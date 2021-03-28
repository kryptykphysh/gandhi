FROM node:0.10
LABEL maintainer="Kryptyk Physh <kryptykphysh@kryptykphysh.xyz>"

SHELL ["/bin/bash", "-c"]

RUN apt-get update -yqq \
  && apt-get upgrade -yqq \
  && apt-get install -yqq --no-install-recommends \
    build-essential \
    python3 \
    python3-pip \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && python3 -m pip install --upgrade pip \
  && mkdir -p /home/node/app/node_modules \
  && chown -R node:node /home/node \
  && npm -i g npm@latest

WORKDIR /home/node/app

COPY ./package*.json ./ 

USER node

RUN npm i

COPY . .

CMD ["npm", "start"]
