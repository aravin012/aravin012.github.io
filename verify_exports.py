"""Smoke-check PDF pagination and browser-generated DOCX downloads.

Run with: python verify_exports.py (requires playwright, pypdf and python-docx).
"""
from pathlib import Path
from tempfile import TemporaryDirectory
from zipfile import ZipFile
import atexit
import os

from docx import Document
from playwright.sync_api import sync_playwright
from pypdf import PdfReader
try:
    import win32com.client
except ImportError:
    win32com = None


ROOT = Path(__file__).parent
def main():
    word = win32com.client.DispatchEx("Word.Application") if win32com else None
    if word:
        atexit.register(word.Quit)
    with TemporaryDirectory(dir=os.environ.get("EXPORT_TEST_TMPDIR")) as temporary, sync_playwright() as playwright:
        output = Path(os.environ.get("EXPORT_TEST_OUTPUT", temporary))
        browser = playwright.chromium.launch()
        page = browser.new_page(accept_downloads=True, ignore_https_errors=True)
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))

        for variant, expected_pages in (("one", 1), ("detailed", 2), ("letter", 1)):
            page.goto((ROOT / "resume.html").as_uri() + f"?format={variant}")
            if variant == "letter":
                page.locator("#recipient").fill("Taylor Smith")
                page.locator("#company").fill("Example Company")
                page.locator("#role").fill("Engineering Lead")

            paper = page.locator(".paper")
            assert paper.count() == expected_pages, f"{variant}: unexpected preview page count"
            for index in range(expected_pages):
                heights = paper.nth(index).evaluate("element => [element.clientHeight, element.scrollHeight]")
                assert heights[1] <= heights[0] + 2, f"{variant}: page {index + 1} overflows: {heights}"
                if os.environ.get("EXPORT_TEST_OUTPUT"):
                    paper.nth(index).screenshot(path=str(output / f"{variant}-{index + 1}.png"))

            pdf_file = output / f"{variant}.pdf"
            page.pdf(path=str(pdf_file), print_background=True, prefer_css_page_size=True)
            assert len(PdfReader(str(pdf_file)).pages) == expected_pages, f"{variant}: PDF pagination"

            page.wait_for_function("() => Boolean(window.docx && window.docx.Packer)", timeout=30000)
            with page.expect_download() as download_info:
                page.locator("#word-button").click()
            download = download_info.value
            word_file = output / download.suggested_filename
            download.save_as(word_file)
            assert word_file.suffix == ".docx"
            with ZipFile(word_file) as archive:
                assert archive.testzip() is None, f"{variant}: corrupt DOCX archive"
                assert not any(name.endswith('/') for name in archive.namelist()), "DOCX has folder entries"
                xml = archive.read("word/document.xml").decode("utf-8")
                if variant == "detailed":
                    assert "pageBreakBefore" in xml, "detailed Word document has no page break"
            document = Document(word_file)
            content = " ".join(paragraph.text for paragraph in document.paragraphs)
            assert "Aravindan Pathirasamy" in content
            if variant == "letter":
                assert "Taylor Smith" in content and "Example Company" in content and "Engineering Lead" in content
            if word:
                word_doc = word.Documents.Open(str(word_file), ReadOnly=True, AddToRecentFiles=False)
                try:
                    word_doc.Repaginate()
                    pages = word_doc.ComputeStatistics(2)  # wdStatisticPages
                    assert pages == expected_pages, f"{variant}: Word has {pages} pages, expected {expected_pages}"
                finally:
                    word_doc.Close(False)
            print(f"{variant}: {expected_pages} PDF page(s), DOCX opens, preview fits")

        assert not errors, f"Browser errors: {errors}"
        browser.close()


if __name__ == "__main__":
    main()
