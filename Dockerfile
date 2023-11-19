FROM node:18.17-alpine

WORKDIR /app
COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

COPY .next ./.next

CMD ["yarn", "dev"]