FROM node:24-alpine

# Match the web container's lightweight base setup.
RUN apk add \
  git \
  tini \
  bash

RUN npm install -g @expo/ngrok

WORKDIR /shared

# Copy entrypoint script first and verify it exists
COPY ./entrypoint.sh /entrypoint.sh
RUN ls -la /entrypoint.sh && chmod +x /entrypoint.sh

COPY ./.env /

EXPOSE 8081 19000 19001 19002 19006

ENTRYPOINT ["tini", "--", "/entrypoint.sh"]
