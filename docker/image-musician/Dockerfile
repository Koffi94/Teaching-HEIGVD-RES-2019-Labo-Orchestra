FROM node:6
WORKDIR /app
COPY ./code/package.json /app
RUN npm install
COPY ./code/ /app
ENTRYPOINT ["node", "index.js"]
