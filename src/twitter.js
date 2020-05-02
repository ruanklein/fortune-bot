const puppeteer = require('puppeteer');

require('dotenv/config');

const
    baseUrl  = 'https://twitter.com/',
    username = process.env.TWITTER_USERNAME,
    password = process.env.TWITTER_PASSWORD,
    phone    = process.env.TWITTER_PHONE;

let
    browser = null,
    page    = null;

const lauchBrowser = async () => {
    if(process.env.NODE_ENV === 'production') {
        return await puppeteer.launch({
            headless: true,
            slowMo: 120,
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
        await page.goto(`${baseUrl}/login`);

        await page.click('input[name="session[username_or_email]"]');
        await page.keyboard.type(username);
        
        await page.click('input[name="session[password]"]');
		await page.keyboard.type(password);

        await page.click('[data-testid="LoginForm_Login_Button"]');

        const challenge = await page.$('#challenge_response');
        
        if(challenge !== null) {
            await page.click('#challenge_response');
            await page.keyboard.type(phone);
            await page.click('#email_challenge_submit');
        }

        await page.waitFor(1000);
    },
    post: async tweet => {
        let url = await page.url();

		if(url !== baseUrl){
            await page.goto(baseUrl);
            await page.waitFor(1000);
        }
        
        await page.click('.DraftEditor-editorContainer');
        
        await page.keyboard.type(tweet);
        
        await page.click('[data-testid="tweetButtonInline"]');
    },
    end: async () => {
        await browser.close();
    }
};