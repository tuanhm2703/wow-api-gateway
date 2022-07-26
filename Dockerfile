# ## Build environment ##
# FROM panoti/mt-web-build:latest as builder

# # Bundle app source
# COPY . /app
# RUN npm run build

## production environment ##
# FROM registry.gitlab.com/pnt239/product-design/api-deps:latest

# WORKDIR /app

FROM node:14-alpine

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app
COPY package-lock.json /app

# https://github.com/Automattic/node-canvas/issues/1486
# RUN npm install --production
# RUN apk add --no-cache --virtual build-dependencies \
#   python \
# #   autoconf \
# #   automake \
# #   libtool \
# #   nasm \
#   make \
#   g++ \
#   alpine-sdk \
#   && apk add --no-cache --virtual .npm-deps jpeg-dev cairo-dev giflib-dev pango-dev \
#   && npm i canvas --build-from-source \
#   && npm install --production \
#   && apk del build-dependencies
RUN npm install --production

# COPY --from=builder /app/dist /app
COPY ./dist /app

ENV NODE_ENV=production
ENV MNL_NATS_SERVERS=localhos:4222
ENV MNL_MONGO_URI=mongodb://dev:dev@localhost:27017/minutelink
ENV MNL_REDIS_HOST=localhost
ENV MNL_REDIS_PORT=6379
ENV MNL_REDIS_PASSWORD=devredis
ENV MNL_OIDC_ISSUER=http://sso.altimatetek.work/
ENV MNL_OIDC_SCOPE="offline_access offline openid"
ENV MNL_OIDC_AUDIENCE=5818ca78-504f-4f96-b709-c99ee5b7b826
ENV MNL_OIDC_JWKS_URI=http://sso.altimatetek.work/.well-known/jwks.json
ENV MNL_S3_HOST=tasks.minute_s3
ENV MNL_S3_PORT=9000
ENV MNL_S3_ACCESS_KEY=dev
ENV MNL_S3_SECRET_KEY=Test1234
ENV MNL_S3_DEFAULT_BUCKET=0a7d55be
ENV MNL_AUTH_SERVICE_GRPC_URL=localhost:9104
ENV MNL_NOTIFICATION_SERVICE_GRPC_URL=localhost:9102

EXPOSE 3000

CMD [ "node", "main" ]
