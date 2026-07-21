# syntax=docker/dockerfile:1

# base

FROM ghcr.io/pnpm/pnpm:11 AS base
RUN pnpm runtime set node 24 -g

WORKDIR /monorepo

COPY packages/ ./packages/
COPY apps/app-frontend/ ./apps/app-frontend/
COPY apps/app-electron/package.json ./apps/app-electron/package.json
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json turbo.json ./

RUN pnpm install --frozen-lockfile

# run app-frontend in dev mode

FROM base AS frontend-dev

COPY packages/ ./packages/
COPY apps/app-frontend/ ./apps/app-frontend/

EXPOSE 5321

# build app-frontend

FROM base AS frontend-build

COPY packages/ ./packages/
COPY apps/app-frontend/ ./apps/app-frontend/

RUN pnpm turbo run build --filter app-frontend

# host static app-frontend build

FROM nginx:alpine AS frontend-prod

COPY --from=frontend-build /monorepo/apps/app-frontend/dist /usr/share/nginx/html

EXPOSE 80
