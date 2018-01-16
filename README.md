![Pixel Server Logo](./images/PixelWallLogo.png)

# PixelServer
> An IoT interactive pixel wall implementation

This project is an implementation of an LED wall controlled through the internet with the use of node, vue.js, johnny-five.js, and a microcontroller. This repository is the server side code that handles the communication between the LED wall and the users through socket.io. For the code handling the hardware implementation, please go [here](https://github.com/RutgersUniversityVirtualWorlds/pixelwall).

## Installing / Getting started

Everything is managed by npm.
Simply initialize with the following:

```shell
npm install
```

Once everything is installed, run the server with:

```shell
node index.js
```

## Run as Docker
```
docker build  -t rianders/pixelserver .
docker run -p 8080:3000  -d rianders/pixelserver
docker ps
docker logs <container id>
docker exec -it <container id>   /bin/bash
```


## Developing
If working on front-end code (files under public directory) then run the following:
```
npm run-script build
```
This will allow webpack to build those files so they can be usable, but also runs an active watch on the same files in order to build them again whenever any changes to these files occur.
The built files can be found under the dist directory.

### Built With
Node.js version 6.11.1
Express version ^4.15.4
Socket.io version ^2.0.3

## Tests

### TO DO

To run the tests simply type the following:

```
npm test
```
Tests can be found in ./tests/ and are built on mocha and chai.

## Licensing

This project is licensed under the Apache License 2.0.
For a copy of this license please go [here](https://www.apache.org/licenses/LICENSE-2.0.html).
