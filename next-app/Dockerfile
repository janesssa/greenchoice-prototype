# # Install dependencies only when needed
# FROM node:alpine AS deps
# # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
# WORKDIR /next-app
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# # Rebuild the source code only when needed
# FROM node:alpine AS builder
# WORKDIR /next-app
# COPY . .
# COPY --from=deps /next-app/node_modules ./node_modules
# RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# # Production image, copy all the files and run next
# FROM node:alpine AS runner
# WORKDIR /next-app

# ENV NODE_ENV production

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

# # Use if the config is changed
# # COPY --from=builder /next-app/next.config.js ./
# COPY --from=builder /next-app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /next-app/.next ./.next
# COPY --from=builder /next-app/node_modules ./node_modules
# COPY --from=builder /next-app/package.json ./package.json

# USER nextjs

# EXPOSE 8080

# # CMD ["yarn", "start"]

FROM node:14.15.4-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN yarn
EXPOSE 8080

ENV GIT_WORK_TREE=/usr/app/frontend GIT_DIR=/usr/app/.git

RUN apk update && \
    apk add git