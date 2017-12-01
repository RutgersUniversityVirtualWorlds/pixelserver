![Pixel Server Logo](./images/PixelWallLogo.png)

# PixelServer
> An IoT interactive pixel wall implementation

This project is an implementation of an LED wall controlled through the internet with the use of node, vue.js, johnny-five.js, and a microcontroller. This repository is the server side code that handles the communication between the LED wall and the users through socket.io. For the code handling the hardware implementation, please go [here](https://github.com/RutgersUniversityVirtualWorlds/pixelwall).

## Installing / Getting started

Everything is managed by npm.
Simply initialize with the following:

```shell
npm init
```

Once everything is installed, run the server with:

```shell
node index.js
```

## Developing

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
