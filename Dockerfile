# ==========================
# 🧱 STAGE 1 — BUILD
# ==========================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma
COPY .env .env

RUN npm ci
RUN npx prisma generate --schema=prisma/schema/schema.prisma

COPY . .
RUN npm run build

# ==========================
# 🚀 STAGE 2 — RUNTIME
# ==========================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.env .env

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="file:/usr/src/app/prisma/dev.db"

RUN npx prisma generate --schema=prisma/schema/schema.prisma

EXPOSE 3000

# ✅ Cria o banco antes de subir o servidor
CMD ["sh", "-c", "npx prisma db push --schema=prisma/schema/schema.prisma && node dist/main.js"]
