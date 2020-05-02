const fortune = require('./src/fortune');
const twitter = require('./src/twitter');
const tags    = require('./src/hashtags');

const getTweet = async () => new Promise(resolve => {
    const task = setInterval(async () => await fortune().then(message => {
        message = message.replace(/\((.*)\)/, '> $1')
                         .replace(/%/, '');
    
        message += '.\n.\n.\n';

        tags.map(tag => message += `#${tag} `);

        if(message.length <= 280) {
            clearInterval(task);
            resolve(message);
        }
    }), 1000);
});

(async () => {
    try {
        const tweet = await getTweet();

        await twitter.initialization();
        await twitter.login();
        await twitter.post(tweet);
        await twitter.end();
    } catch(e) {
        console.error(e);
    }
})();