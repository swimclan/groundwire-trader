FROM node:latest

#create app folder
RUN mkdir /tradingapp
WORKDIR /tradingapp

#cache npm dependencies
COPY package.json /tradingapp
RUN npm install

#copy application files
COPY . /tradingapp

#run the application in the image
CMD ["node", "bin/www"]