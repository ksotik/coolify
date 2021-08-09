FROM node:lts
WORKDIR /usr/src/app
RUN curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-20.10.6.tgz | tar -xzvf - docker/docker -C . --strip-components 1
RUN mv /usr/src/app/docker /usr/bin/docker
RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.2.0/envsubst-`uname -s`-`uname -m` -o /usr/bin/envsubst
RUN curl -L https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 -o /usr/bin/jq
RUN chmod +x /usr/bin/envsubst /usr/bin/jq /usr/bin/docker
COPY ./*package.json .
RUN yarn install
COPY . .
RUN yarn build
CMD ["yarn", "start"]
EXPOSE 3000