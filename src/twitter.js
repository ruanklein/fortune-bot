const puppeteer = require('puppeteer');

const moment = require('moment');

require('dotenv/config');

const
    baseUrl     = 'https://twitter.com/',
    isEnvProd   = process.env.NODE_ENV === 'production',
    username    = process.env.TWITTER_USERNAME,
    password    = process.env.TWITTER_PASSWORD,
    phone       = process.env.TWITTER_PHONE;

let
    browser = null,
    page    = null;

const lauchBrowser = async () => {
    if(isEnvProd) {
        return await puppeteer.launch({
            headless: true,
            slowMo: 220,
            args: ['--no-sandbox']
        });
    }

    return await puppeteer.launch({
            headless: false,
            slowMo: 120,
            defaultViewport: {
                width: 1024,
                height: 768
            }
    });
};

module.exports = {
    initialization: async () => {
        browser = await lauchBrowser();

        page = await browser.newPage();
        await page.goto(baseUrl);
    },
    login: async () => {
        try {
            await page.goto(`${baseUrl}/login`);

            await page.click('input[name="session[username_or_email]"]');
            await page.keyboard.type(username);
            
            await page.click('input[name="session[password]"]');
            await page.keyboard.type(password);

            await page.click('[data-testid="LoginForm_Login_Button"]');
            await page.waitFor(1000);

            const challenge = await page.$('#challenge_response');
        
            if(challenge !== null) {
                await page.click('#challenge_response');
                await page.keyboard.type(phone);
                await page.click('#email_challenge_submit');

                await page.waitFor(1000);
            }
        } catch(e) {
            if(isEnvProd) {
                await page.screenshot({ 
                    path: `image/screenshot_${moment().format('YYYY-MM-DD_HH-mm-ss')}.png` 
                });
            }
            throw e;
        }
        
    },
    post: async tweet => {
        try {
            let url = await page.url();

            if(url !== baseUrl) {
                await page.goto(baseUrl);
                await page.waitFor(1000);
            }
        
            await page.click('[data-testid="tweetTextarea_0"]');
            await page.keyboard.type(tweet);
            
            await page.click('[data-testid="tweetButtonInline"]');
        } catch(e) {
            if(isEnvProd) {
                await page.screenshot({ 
                    path: `image/screenshot_${moment().format('YYYY-MM-DD_HH-mm-ss')}.png` 
                });
            }
            throw e;
        }
    },
    end: async () => {
        await browser.close();
    }
};