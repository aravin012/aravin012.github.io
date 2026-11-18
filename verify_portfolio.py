"""Check project ordering and consistent card layout at desktop and mobile widths."""
from pathlib import Path
import os

from playwright.sync_api import sync_playwright


URL = (Path(__file__).parent / "index.html").as_uri() + "#projects"


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        for width in (1440, 1024, 390):
            page = browser.new_page(viewport={"width": width, "height": 900})
            page.goto(URL)
            page.add_style_tag(content="html { scroll-behavior: auto !important; } .project-card, .project-card:hover { opacity: 1 !important; transform: none !important; transition: none !important; }")
            page.locator("#projects").scroll_into_view_if_needed()
            cards = page.locator("#projectsGrid .project-card")
            assert cards.count() == 6
            titles = cards.locator(".project-title").all_text_contents()
            assert "Multi-Agent Engineering Framework" in titles[0]
            assert titles.index("MinionBot AI Platform") > 0
            assert all(cards.nth(i).locator(".project-highlights li").count() == 2 for i in range(6))
            bounds = page.locator("#projectsGrid").evaluate("grid => [...grid.children].map(card => { const {x, y, width, height} = card.getBoundingClientRect(); return {x, y, width, height}; })")
            assert all(bound["x"] >= 0 and bound["x"] + bound["width"] <= width + 1 for bound in bounds)
            if width > 768:
                assert abs(bounds[0]["width"] - bounds[1]["width"]) < 1
                assert abs(bounds[0]["height"] - bounds[1]["height"]) < 1
                assert abs(bounds[0]["y"] - bounds[1]["y"]) < 2
            else:
                assert bounds[1]["y"] > bounds[0]["y"]
            if os.environ.get("PORTFOLIO_SCREENSHOT_DIR"):
                page.locator("#projects").screenshot(path=str(Path(os.environ["PORTFOLIO_SCREENSHOT_DIR"]) / f"projects-{width}.png"))
            print(f"{width}px: six aligned cards; framework first, MinionBot de-emphasized")
            page.close()
        browser.close()


if __name__ == "__main__":
    main()
