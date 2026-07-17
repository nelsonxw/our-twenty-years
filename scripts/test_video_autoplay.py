from playwright.sync_api import sync_playwright
import os
import sys

URL = os.environ.get("TEST_URL", "http://localhost:3000")


def wait_for_video_state(page, expected_paused: bool, timeout_ms: int = 30000):
    """Poll until the 2006 video's paused state matches expected_paused."""
    page.wait_for_function(
        f"document.querySelector('#year-2006 video').paused === {str(expected_paused).lower()}",
        timeout=timeout_ms,
    )


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            channel="chrome",
            args=["--autoplay-policy=no-user-gesture-required"],
        )
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        print("Opening page...")
        page.goto(URL, wait_until="domcontentloaded", timeout=120000)
        page.wait_for_selector("#year-2006 video", timeout=120000)
        print("2006 video element found")

        # Scroll to 2006 (video should be in view and play)
        page.evaluate(
            "document.getElementById('year-2006').scrollIntoView({behavior: 'instant', block: 'start'})"
        )
        print("Waiting for video to play...")
        wait_for_video_state(page, False)
        print("Video is playing in view")

        # Scroll down past 2006 (video should pause)
        page.evaluate("window.scrollBy(0, window.innerHeight * 3)")
        print("Waiting for video to pause after scrolling down...")
        wait_for_video_state(page, True)
        print("Video paused after scrolling down")

        # Scroll back to 2006 (video should resume)
        page.evaluate(
            "document.getElementById('year-2006').scrollIntoView({behavior: 'instant', block: 'start'})"
        )
        print("Waiting for video to resume...")
        wait_for_video_state(page, False)
        print("Video resumed after scrolling back")

        # Scroll to the top / hero section (video should pause again)
        page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
        print("Waiting for video to pause after scrolling up to hero...")
        wait_for_video_state(page, True)
        print("Video paused after scrolling up")

        print("\nPASS")
        browser.close()


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"\nFAIL: {exc}")
        sys.exit(1)
