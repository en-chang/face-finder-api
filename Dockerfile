FROM node:14.17.1

WORKDIR /usr/src/face-finder-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]