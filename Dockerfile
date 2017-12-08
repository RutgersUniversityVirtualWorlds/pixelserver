FROM node:carbon

# Create App Directory
WORKDIR /usr/src/pixelserver

# Install App Depedencies
COPY package*.json ./

RUN npm install --only=production

# Bundle app source
COPY . .

# Port

EXPOSE 3000
CMD [ "npm", "start" ]

