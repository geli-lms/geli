FROM node:8.9.0

WORKDIR /usr/src/app

ENV DB_HOST=db
ENV PORT=80

EXPOSE 80

CMD node server.js

RUN mkdir -p /usr/src/app/uploads

RUN mkdir -p /usr/src/app/tmp
RUN chmod a+rwx /usr/src/app/tmp

COPY api/build/src /usr/src/app/
COPY api/node_modules /usr/src/app/node_modules
COPY api/nlf-licenses.json /usr/src/app/
