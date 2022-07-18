const puppeteer = require("puppeteer")
const validate = require("../helpers/input.validate")

module.exports = {
  screenshot: async (req, res, next) => {
    const {
      error
    } = validate(req.body)
    if (error) return next(error)

    const {
      url
    } = req.body

    try {
      // Make Pupperteer Start Faster

      const minimal_args = [
        '--autoplay-policy=user-gesture-required',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-dev-shm-usage',
        '--disable-domain-reliability',
        '--disable-extensions',
        '--disable-features=AudioServiceOutOfProcess',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-popup-blocking',
        '--disable-print-preview',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-sync',
        '--hide-scrollbars',
        '--ignore-gpu-blacklist',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-first-run',
        '--no-pings',
        '--no-sandbox',
        '--no-zygote',
        '--password-store=basic',
        '--use-gl=swiftshader',
        '--use-mock-keychain',
      ];

      const browser = await puppeteer.launch({
        defaultViewport: {
          width: 1920,
          height: 1080
        },
        ignoreDefaultArgs: ["--disable-extentions"],
        args: minimal_args
      })

      const page = await browser.newPage()

      const blocked_domains = [
        'googlesyndication.com',
        'adservice.google.com',
      ];

      await page.setRequestInterception(true);
      page.on('request', request => {
        const url = request.url()
        if (blocked_domains.some(domain => url.includes(domain))) {
          request.abort();
        } else {
          request.continue();
        }
      });

      await page.goto(url, {
        waitUntil: "load",
        timeout: 50000
      })
      const result = await page.screenshot({
        encoding: "base64"
      })

      await browser.close()

      res.status(200).json({
        status: 200,
        success: true,
        response: {
          base64: result,
        }
      })
    } catch (error) {
      next(error)
    }
  }
}