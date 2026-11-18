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
    import fitz
except ImportError:
    fitz = None
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

        cases = [(variant, template, palette, pages)
                 for template, palette in (("classic", "navy"), ("editorial", "sage"), ("executive", "graphite"))
                 for variant, pages in (("one", 1), ("detailed", 2), ("letter", 1))]
        for variant, template, palette, expected_pages in cases:
            label = f"{variant}-{template}-{palette}"
            page.goto((ROOT / "resume.html").as_uri() + f"?format={variant}&template={template}&palette={palette}")
            page.wait_for_function("() => Boolean(document.querySelector('.preview')?.dataset.template)")
            assert page.locator(".preview").get_attribute("data-template") == template
            assert page.locator(".preview").get_attribute("data-palette") == palette
            if label == "one-classic-navy":
                page.locator('input[name="template"][value="editorial"]').check()
                page.locator('input[name="palette"][value="sage"]').check()
                assert page.locator(".preview").get_attribute("data-template") == "editorial"
                assert page.locator(".preview").get_attribute("data-palette") == "sage"
                page.locator('input[name="template"][value="classic"]').check()
                page.locator('input[name="palette"][value="navy"]').check()
            if variant == "letter":
                page.locator("#recipient").fill("Taylor Smith")
                page.locator("#company").fill("Example Company")
                page.locator("#role").fill("Engineering Lead")

            paper = page.locator(".paper")
            assert paper.count() == expected_pages, f"{label}: unexpected preview page count"
            for index in range(expected_pages):
                heights = paper.nth(index).evaluate("element => [element.clientHeight, element.scrollHeight]")
                if variant == "one":
                    columns = page.locator(".one-page-columns").evaluate("element => [element.firstElementChild.offsetHeight, element.lastElementChild.offsetHeight]")
                    assert abs(columns[0] - columns[1]) < heights[0] * 0.10, f"{label}: columns unbalanced {columns}"
                assert heights[1] <= heights[0] + 2, f"{label}: page {index + 1} overflows: {heights}"
                used = paper.nth(index).evaluate("element => ((element.querySelector('.one-page-columns') || element.querySelector('.doc-section:last-of-type') || element.lastElementChild).getBoundingClientRect().bottom - element.getBoundingClientRect().top) / element.clientHeight")
                minimum = 0.70 if variant == "letter" else 0.76 if variant == "detailed" else 0.82
                assert minimum <= used < 0.97, f"{label}: page {index + 1} uses {used:.0%}; expected {minimum:.0%}–96%"
                if os.environ.get("EXPORT_TEST_OUTPUT"):
                    paper.nth(index).screenshot(path=str(output / f"{label}-{index + 1}.png"))

            pdf_file = output / f"{label}.pdf"
            page.pdf(path=str(pdf_file), print_background=True, prefer_css_page_size=True)
            assert len(PdfReader(str(pdf_file)).pages) == expected_pages, f"{label}: PDF pagination"

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
            assert "aravindan pathirasamy" in content.casefold()
            if variant == "one":
                assert len(document.tables) == 1 and len(document.tables[0].rows[0].cells) == 2
                first = document.tables[0].cell(0, 0).text
                second = document.tables[0].cell(0, 1).text
                assert ("Zinnia" in first and "TECHNICAL EXPERTISE" in second) if template == "classic" else ("TECHNICAL EXPERTISE" in first and "Zinnia" in second)
            if variant == "letter":
                assert "Taylor Smith" in content and "Example Company" in content and "Engineering Lead" in content
            if word:
                word_doc = word.Documents.Open(str(word_file), ReadOnly=True, AddToRecentFiles=False)
                try:
                    word_doc.Repaginate()
                    pages = word_doc.ComputeStatistics(2)  # wdStatisticPages
                    if fitz:
                        rendered_word = output / f"{label}-word.pdf"
                        word_doc.ExportAsFixedFormat(str(rendered_word), 17)  # wdExportFormatPDF
                        with fitz.open(rendered_word) as rendered:
                            for index, word_page in enumerate(rendered):
                                blocks = [block for block in word_page.get_text("blocks") if block[4].strip()]
                                used = max(block[3] for block in blocks) / word_page.rect.height
                                minimum = 0.68 if variant == "letter" else 0.74 if variant == "detailed" else 0.78
                                assert minimum <= used < 0.96, f"{label}: Word page {index + 1} uses {used:.0%}"
                                if os.environ.get("EXPORT_TEST_OUTPUT"):
                                    word_page.get_pixmap(matrix=fitz.Matrix(1.3, 1.3)).save(output / f"{label}-word-{index + 1}.png")
                    assert pages == expected_pages, f"{label}: Word has {pages} pages, expected {expected_pages}"
                finally:
                    word_doc.Close(False)
            print(f"{label}: {expected_pages} PDF page(s), DOCX opens, preview fits")

        assert not errors, f"Browser errors: {errors}"
        page.set_viewport_size({"width": 390, "height": 844})
        page.goto((ROOT / "resume.html").as_uri() + "?format=one")
        page.locator('input[name="template"][value="editorial"]').check()
        page.locator('input[name="palette"][value="sage"]').check()
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), "mobile page scrolls horizontally"
        assert page.locator(".controls").bounding_box()["width"] <= 390
        if os.environ.get("EXPORT_TEST_OUTPUT"):
            page.screenshot(path=str(output / "document-studio-mobile.png"), full_page=True)
        browser.close()


if __name__ == "__main__":
    main()
