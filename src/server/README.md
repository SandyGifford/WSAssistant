# WS Assistant (client)

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

## Server usage

### JavaScript

```javascript
const { WSSAssistantServer } = require("ws-assistant-server");

// create server
const server = new WSSAssistantServer(3000);

// stored values
let favoriteColor = [0, 0, 0];
let favoriteNumber = 0;

// listen for new connections
server.onConnected(async (client, ip) => {
	// log new connection
	console.log(`Opened websocket connection to ${ip}`);

	// send existing data to new client
	client.send("favoriteColor", favoriteColor);
	client.send("favoriteNumber", favoriteNumber);

	// listen to incoming messages
	client.addMessageListener("favoriteColor", newFavoriteColor => {
		// update stored data so it can be sent to new connections
		favoriteColor = newFavoriteColor;
		// send updated value to all other clients
		server.sendToAllExcept("favoriteColor", [client], favoriteColor);
	});
	client.addMessageListener("favoriteNumber", newFavoriteNumber => {
		// update stored data so it can be sent to new connections
		favoriteNumber = newFavoriteNumber;
		// send updated value to all other clients
		server.sendToAllExcept("favoriteNumber", [client], favoriteNumber);
	});

	// log clients closing connection
	client.addEventListener("close", () => console.log(`Closed websocket connection to ${ip}`));
});
```

### TypeScript

```typescript
import { WSSAssistantServer } from "ws-assistant-server";

// incoming/outgoing message types
interface WebSocketDataMap {
	favoriteColor: [number, number, number];
	favoriteNumber: number;
}

// create server
const server = new WSSAssistantServer<WebSocketDataMap>(3000);

// stored values
let favoriteColor: [number, number, number] = [0, 0, 0];
let favoriteNumber: number = 0;

// listen for new connections
server.onConnected(async (client, ip) => {
	// log new connection
	console.log(`Opened websocket connection to ${ip}`);

	// send existing data to new client
	client.send("favoriteColor", favoriteColor);
	client.send("favoriteNumber", favoriteNumber);

	// listen to incoming messages
	client.addMessageListener("favoriteColor", newFavoriteColor => {
		// update stored data so it can be sent to new connections
		favoriteColor = newFavoriteColor;
		// send updated value to all other clients
		server.sendToAllExcept("favoriteColor", [client], favoriteColor);
	});
	client.addMessageListener("favoriteNumber", newFavoriteNumber => {
		// update stored data so it can be sent to new connections
		favoriteNumber = newFavoriteNumber;
		// send updated value to all other clients
		server.sendToAllExcept("favoriteNumber", [client], favoriteNumber);
	});

	// log clients closing connection
	client.addEventListener("close", () => console.log(`Closed websocket connection to ${ip}`));
});
```

## Reference

### `class WSSAssistantServer(port: number)`

Core class for WS Assistant Server.  Creates a web socket server.

#### arguments

- **`port`** (**required**, `number`): The port to listen on.

#### methods

- **`send(type: string, data?: any): void`**: Send is not supported on `WSSAssistantServer`.  use `WSSAssistantServer.sendToAll` or `WSSAssistantServer.sendToAllExcept` instead.
- **`close(): void`**: Closes connection to all clients.
- **`addEventListener(type: string, listener(e: Event) => void): void`**: Calls `addEventListener` on every connected client.
	- **arguments**
		- **`type`** (**required**, `string`): Event type.  See documentation for [ws events](https://github.com/websockets/ws/blob/master/doc/ws.md#websocketaddeventlistenertype-listener-options).
		- **`listener`** (**required**, `(e: Event) => void`): Event listener.  See documentation for [ws events](https://github.com/websockets/ws/blob/master/doc/ws.md#websocketaddeventlistenertype-listener-options).
- **`removeEventListener(type: string, listener(e: Event) => void): void`**: Calls `removeEventListener` on every connected client.
	- **arguments**
		- **`type`** (**required**, `string`): Event type.  See documentation for [ws events](https://github.com/websockets/ws/blob/master/doc/ws.md#websocketaddeventlistenertype-listener-options).
		- **`listener`** (**required**, `(e: Event) => void`): Event listener.  See documentation for [ws events](https://github.com/websockets/ws/blob/master/doc/ws.md#websocketaddeventlistenertype-listener-options).
- **`addMessageListener(type: string, listener(e: Event) => void): void`**: Calls `addMessageListener` on every connected client.
	- **arguments**
		- **`type`** (**required**, `string`): Message type.
		- **`listener`** (**required**, `(data: any) => void`): Message listener.
	- **TypeScript**
		- `type` and `data` in listener are defined by the interface passed into the generic on `WSAssistantServer`.
- **`removeMessageListener(type: string, listener(e: Event) => void): void`**: Calls `removeMessageListener` on every connected client.
	- **arguments**
		- **`type`** (**required**, `string`): Message type.
		- **`listener`** (**required**, `(data: any) => void`): Message listener.
	- **TypeScript**
		- `type` and `data` in listener are defined by the interface passed into the generic on `WSAssistantServer`.
- **`onConnect(listener(client: WSAssistantServer, ip: string)): void`**: Calls [`NodeWebSocket.Server.on("connection", ...)`](https://github.com/websockets/ws/blob/master/doc/ws.md#event-connection) but passes the `WSAssistantServer` and `ip` to the listener.
- **`onDisconnected(listener()): void`**: Calls [`NodeWebSocket.Server.on("close", ...)`](https://github.com/websockets/ws/blob/master/doc/ws.md#event-connection).
- **`sendToAll(type: string, data?: any): void`**: Sends a message of type `type` with data `data` to all clients.
	- **arguments**
		- **`type`** (**required**, `string`): The type of the message being sent, listeners on the server will only fire if listening to this type.
		- **`data`** (*optional*, `any`): The data to send to the clients.
	- **TypeScript**
		- `type` and `data` are defined by the interface passed into the generic on `WSAssistantServer`.
- **`sendToAllExcept(type: string, skip: WSAssistantServer<M>[], data?: any): void`**: Sends a message of type `type` with data `data` to all clients except those listed in the `skip` argument.
	- **arguments**
		- **`type`** (**required**, `string`): The type of the message being sent, listeners on the server will only fire if listening to this type.
		- **`skip`** (**required**, `WSAssistantServer[]`): An array of clients to not send the message to.
		- **`data`** (*optional*, `any`): The data to send to the clients.
	- **TypeScript**
		- `type` and `data` are defined by the interface passed into the generic on `WSAssistantServer`.

#### TypeScript

`WSSAssistantServer` takes a single generic component.  It should be an interface that maps message types to the data they send and receive.

### `class WSAssistantServer(ws: NodeWebSocket)`

Class representing a single connection.  Usually you won't have to create this object directly as `WSSAssistantServer` will instantiate them for you.

#### arguments

- **`ws`** (**required**, `NodeWebSocket`): The WebSocket object representing the connection.  See [ws documentation](https://www.npmjs.com/package/ws).

#### methods

- **`send(type: string, data?: any): void`**: Sends a message of type `type` with data `data` to the client.
	- **arguments**
		- **`type`** (**required**, `string`): The type of the message being sent, listeners on the server will only fire if listening to this type.
		- **`data`** (*optional*, `any`): The data to send to the client.
	- **TypeScript**
		- `type` and `data` are defined by the interface passed into the generic on `WSAssistantServer`.
- **`close(): void`**: Closes connection the client.
- **`addEventListener(type: string, listener(e: Event) => void): void`**: Listens to WebSocket events.  Effectively a wrapper to [`ws.addEventListener`](https://github.com/websockets/ws/blob/master/doc/ws.md#websocketaddeventlistenertype-listener-options).
	- **arguments**
		- **`type`** (**required**, `string`): Event type.  See documentation for [ws events](https://github.com/websockets/ws/blob/master/doc/ws.md#websocketaddeventlistenertype-listener-options).
		- **`listener`** (**required**, `(e: Event) => void`): Event listener.  See documentation for [ws events](https://github.com/websockets/ws/blob/master/doc/ws.md#websocketaddeventlistenertype-listener-options).
- **`removeEventListener(type: string, listener(e: Event) => void): void`**: Stops listening to WebSocket events.  Effectively a wrapper to [`ws.removeEventListener`](https://github.com/websockets/ws/blob/master/doc/ws.md#websocketremoveeventlistenertype-listener).
	- **arguments**
		- **`type`** (**required**, `string`): Event type.  See documentation for [ws events](https://github.com/websockets/ws/blob/master/doc/ws.md#websocketaddeventlistenertype-listener-options).
		- **`listener`** (**required**, `(e: Event) => void`): Event listener.  See documentation for [ws events](https://github.com/websockets/ws/blob/master/doc/ws.md#websocketaddeventlistenertype-listener-options).
- **`addMessageListener(type: string, listener(e: Event) => void): void`**: Listens to WebSocket message events of a certain type.  Type is not part of WebSocket standard, and is a feature in Websocket Assistant.
	- **arguments**
		- **`type`** (**required**, `string`): Message type.
		- **`listener`** (**required**, `(data: any) => void`): Message listener.
	- **TypeScript**
		- `type` and `data` in listener are defined by the interface passed into the generic on `WSAssistantServer`.
- **`removeMessageListener(type: string, listener(e: Event) => void): void`**: Stops listening to WebSocket message events of a certain type.  Type is not part of WebSocket standard, and is a feature in Websocket Assistant.
	- **arguments**
		- **`type`** (**required**, `string`): Message type.
		- **`listener`** (**required**, `(data: any) => void`): Message listener.
	- **TypeScript**
		- `type` and `data` in listener are defined by the interface passed into the generic on `WSAssistantServer`.

#### TypeScript

`WSAssistantServer` takes a single generic component.  It should be an interface that maps message types to the data they send and receive.
