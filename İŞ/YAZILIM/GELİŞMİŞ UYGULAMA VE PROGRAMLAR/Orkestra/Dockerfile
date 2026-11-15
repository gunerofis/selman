FROM node:24.19.0-bookworm-slim
WORKDIR /app
COPY --chown=node:node . .
RUN mkdir -p /app/data && chown node:node /app/data
USER node
ENV HOST=0.0.0.0
EXPOSE 3100
CMD ["node", "apps/api/server.mjs"]
