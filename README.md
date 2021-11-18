# WS Assistant

WS Assistant is a utility to help create and maintain web socket connections.  It has two modules ([client](https://www.npmjs.com/package/ws-assistant-client) and [server](https://www.npmjs.com/package/ws-assistant-client)) which can work both with eachother or individually.

## Why WS Assistant?

WS Assistant handles several common use cases for WebSockets that aren't included in native implementations.  Unlike [Socket.io](https://www.npmjs.com/package/socket.io), WS Assistant does not require a custom protocol to make connections, and only depends on a simple data structure for some features.

- clients automatically reconnect as long as the browser session is active
- clients automatically re-add any message and event listeners when reconnecting
- both server and client can listen-for and send-messages-of a certain "type"
- both server and client can operate independantly of eachother; using message-types only requires a simple data structure; using a different data structure will not raise any errors
- server has a single dependency (included as a peer-dependency) of [`ws`](https://www.npmjs.com/package/ws), a basic, small implementation of WebSockets
- servers can send-to-all (or send-to-all-except) with a single function
- full TypeScript support built-in including easy, simple strong message typing

## Installation

client:

`npm i ws-assistant-client`

server:

`npm i ws-assistant-server`
