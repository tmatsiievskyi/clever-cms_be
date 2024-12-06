FROM node:23.2-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY ./prisma prisma

RUN npm install -g pnpm
RUN pnpm install 

COPY . .

RUN npx prisma generate

CMD ["pnpm", "run", "start:dev"]