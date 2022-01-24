FROM node:alpine

WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
# RUN yarn build

CMD ["yarn", "start:dev"]
# CMD ["yarn", "start:prod"]