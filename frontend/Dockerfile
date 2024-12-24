# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
WORKDIR /temp/dev
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build


# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=install /temp/dev/dist dist
COPY --from=install /temp/dev/package.json .

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bunx", "serve", "-l" , "3000", "dist" ]

