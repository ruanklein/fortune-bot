const { spawn } = require('child_process');

module.exports = async () => new Promise((resolve, reject) => {
    const fortune = spawn('fortune', ['-s', '-c']);

    fortune.stdout.on('data', data => {
        resolve(data.toString());
    });

    fortune.stderr.on('data', data => {
        reject(data.toString());
    });
});