# # DEVELOPMENT

# FROM node:alpine As development

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN yarn install --only=development

# COPY . .

# RUN yarn build

# # PRODUCTION
# FROM node:alpine As production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN yarn install --only=production

# COPY . .

# COPY --from=development /usr/src/app/dist ./dist

# CMD ["node", "dist/main"]

FROM node:alpine

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

CMD ["yarn", "start:dev"]