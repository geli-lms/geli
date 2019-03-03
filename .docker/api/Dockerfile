FROM node:10.13

WORKDIR /usr/src/app

ENV DB_HOST=db
ENV PORT=80

EXPOSE 80

CMD node server.js

RUN apt-get update -y && apt-get install libfontconfig1 -y

RUN mkdir -p /usr/src/app/uploads
RUN mkdir -p /usr/src/app/uploads/courses

RUN mkdir -p /usr/src/app/tmp
RUN chmod a+rwx /usr/src/app/tmp

COPY api/build/src /usr/src/app/
COPY api/build/styles /usr/src/styles/
COPY api/node_modules /usr/src/app/node_modules
COPY api/nlf-licenses.json /usr/src/app/
COPY api/package.json /usr/src/app/
COPY api/package-lock.json /usr/src/app/

RUN npm rebuild
