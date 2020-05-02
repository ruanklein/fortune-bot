# Fortune BOT

![fortune-bot](image/fortune-bot.png)

Generate message from Fortune CLI and post in twitter!

## Configure

### For all environments

Copy `.env.example` to `.env` and type your twitter credentials (and your phone number) on `.env`.

### Local environment 

Run yarn to install dependencies:

```
yarn install
```

Also, install fortune from package manager. E.g on Debian:

```
sudo apt install fortune
```

### Docker environment

Build image:

```
docker build . --no-cache -t bot/fortune
```

## Start

### Local environment

Run:

```
yarn start
```

For debugging/dev:

```
yarn dev
```

### Docker environment

Run:

```
docker run -it --rm --name tweet-fortune bot/fortune
```
