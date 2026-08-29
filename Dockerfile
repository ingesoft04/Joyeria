FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY public ./public
COPY data ./data
COPY tests ./tests
RUN chmod -R a+rX /app && mkdir -p /app/storage && chown node:node /app/storage
ENV NODE_ENV=production PORT=3000 BASE_PATH=/joyeria
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -qO- http://127.0.0.1:3000/joyeria/api/health || exit 1
USER node
CMD ["node","src/server.js"]
