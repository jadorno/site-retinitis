FROM node:17-alpine3.12
 
WORKDIR /usr/src/app
 
COPY package.json package.json
 
RUN npm install
 
COPY . .
 
CMD [ "npm", "start" ]