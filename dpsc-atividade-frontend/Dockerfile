FROM node:18

WORKDIR /app

COPY package*.json ./

RUN corepack enable

RUN rm -rf node_modules yarn.lock package-lock.json

RUN yarn install --frozen-lockfile --ignore-optional

COPY . .

EXPOSE 3000

CMD ["yarn", "dev", "--host"]