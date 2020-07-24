FROM node:current-slim
WORKDIR ./superWeather
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]
