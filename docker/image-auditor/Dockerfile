FROM node:6
WORKDIR /app
COPY ./code/package.json /app
RUN npm install
COPY ./code/ /app
CMD node index.js
EXPOSE 2205
EXPOSE 2206
