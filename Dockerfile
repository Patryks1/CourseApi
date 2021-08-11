FROM node:latest
WORKDIR /coursesApi
COPY . /coursesApi
COPY package.json /coursesApi
RUN yarn install
COPY . /coursesApi
EXPOSE 8080
CMD ["yarn", "start"]
