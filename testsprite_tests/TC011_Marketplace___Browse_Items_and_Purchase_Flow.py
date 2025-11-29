import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page
        page = await context.new_page()
        
        # Navigate to URL
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for load
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Navigate to Marketplace
        # frame = context.pages[-1]
        # elem = frame.locator('xpath=html/body/div[2]/header/div/div/nav/a').nth(0)
        
        if await page.locator("text=Marketplace").count() > 0:
             await page.click("text=Marketplace")
        else:
             await page.goto("http://localhost:3000/marketplace")
             
        await page.wait_for_timeout(2000)

        # Click Buy on first item
        await page.click("button:has-text('Buy Now') >> nth=0")
        
        # Assert Success Message
        try:
            await expect(page.locator('text=Purchase Completed Successfully!').first).to_be_visible(timeout=5000)
        except AssertionError:
            raise AssertionError('Test case failed: Purchase success message not found.')
        await asyncio.sleep(2)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())