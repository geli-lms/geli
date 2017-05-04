FROM node:7.9.0

COPY api/build /usr/src/app/
COPY api/node_modules /usr/src/app/node_modules

WORKDIR /usr/src/app

ENV DB_HOST=db
ENV PORT=80

EXPOSE 80

CMD node server.js
