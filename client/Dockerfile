# FROM node:lts as builder

# WORKDIR /app

# COPY . .

# RUN yarn install \
#   --prefer-offline \
#   --frozen-lockfile \
#   --non-interactive \
#   --production=false

# RUN yarn build

# RUN rm -rf node_modules && \
#   NODE_ENV=production yarn install \
#   --prefer-offline \
#   --pure-lockfile \
#   --non-interactive \
#   --production=true

# FROM node:lts

# WORKDIR /app

# COPY --from=builder /app  .

# CMD [ "yarn", "start" ]

FROM node:lts

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

CMD ["yarn", "dev"]