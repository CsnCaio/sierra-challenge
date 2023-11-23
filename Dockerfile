FROM node:18-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
EXPOSE 3000
CMD [ "pnpm", "start:dev" ]