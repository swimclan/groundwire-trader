FROM node:latest

#create app folder
RUN mkdir /tradingapp
WORKDIR /tradingapp

#cache npm dependencies
COPY package.json /tradingapp
RUN npm install

#copy application files
COPY . /tradingapp
RUN npm config set cafile=/tradingapp/ssl/groundwire.co.pem -g

#run the application in the image
EXPOSE 3001
CMD ["node", "bin/www"]