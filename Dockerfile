FROM debian:buster

ENV PATH="${PATH}:/usr/games"

# Google Chrome for puppeteer
RUN apt-get update \
    && apt-get -y install wget gnupg fortune curl \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub \
    | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" \
    | tee /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get -y install --no-install-recommends \
        google-chrome-stable \
        fonts-ipafont-gothic \
        fonts-wqy-zenhei \
        fonts-thai-tlwg \
        fonts-kacst \
        fonts-freefont-ttf

# Node.js and yarn
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - \
    && curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg \
    | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" \
    | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get -y install nodejs yarn

RUN apt-get clean \ 
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY . .

RUN yarn install

CMD yarn start