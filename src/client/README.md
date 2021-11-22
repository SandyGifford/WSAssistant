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

## Client usage

### JavaScript

```javascript
const { WSAssistantClient } = require("ws-assistant-client");

// instantiate assistant
const ws = new WSAssistantClient(`ws://${location.hostname}:3000/`);

// stored values
let favoriteColor = [0, 0, 0];
let favoriteNumber = 0;

// listen to messages-of-type from server and updated stored values
ws.addMessageListener("favoriteColor", newFavoriteColor => favoriteColor = newFavoriteColor);
ws.addMessageListener("favoriteNumber", newFavoriteNumber => favoriteNumber = newFavoriteNumber);

// open websocket
ws.open();

// send new values to server
ws.send("favoriteNumber", Math.round(Math.random() * 100));
ws.send("favoriteColor", [Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255)]);
```

### TypeScript

```typescript
import { WSAssistantClient } from "ws-assistant-client";

// incoming/outgoing message types
interface WebSocketDataMap {
	favoriteColor: [number, number, number];
	favoriteNumber: number;
}

// instantiate assistant
const ws = new WSAssistantClient<WebSocketDataMap>(`ws://${location.hostname}:3000/`);

// stored values
let favoriteColor: [number, number, number] = [0, 0, 0];
let favoriteNumber: number = 0;

// listen to messages-of-type from server and updated stored values
ws.addMessageListener("favoriteColor", newFavoriteColor => favoriteColor = newFavoriteColor);
ws.addMessageListener("favoriteNumber", newFavoriteNumber => favoriteNumber = newFavoriteNumber);

// open websocket
ws.open();

// send new values to server
ws.send("favoriteNumber", Math.round(Math.random() * 100));
ws.send("favoriteColor", [Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255)]);
```

## Reference

### `class WSAssistantClient(url: string, retryMS?: number)`

Core class for WS Assistant Client.

#### arguments

- **`url`** (**required**, `string`): URL to the WebSocket server, port included when appropriate.
- **`retryMS`** (*optional*, `number`): The number of milliseconds to wait between retry attempts when the connection fails.

#### methods

- **`send(type: string, data?: any): void`**: Sends a message of type `type` with data `data` to the server.
	- **arguments**
		- **`type`** (**required**, `string`): The type of the message being sent, listeners on the server will only fire if listening to this type.
		- **`data`** (*optional*, `any`): The data to send to the server.
	- **TypeScript**
		- `type` and `data` are defined by the interface passed into the generic on `WSAssistantClient`.
- **`async open(): Promise<void>`**: Opens connection the server.
	- **returns**: A promise which completes upon successfully opening connection.
- **`async close(): Promise<void>`**: Closes connection the server.
	- **returns**: A promise which completes upon successfully closing connection.
- **`addEventListener(type: string, listener(e: Event) => void): void`**: Listens to WebSocket events.  Effectively a wrapper to [`WebSocket.addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#events) that also tracks added listeners so they can be re-added when reconnecting.
	- **arguments**
		- **`type`** (**required**, `string`): Event type.  See documentation for [WebSocket events](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#events).
		- **`listener`** (**required**, `(e: Event) => void`): Event listener.  See documentation for [WebSocket events](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#events).
- **`removeEventListener(type: string, listener(e: Event) => void): void`**: Stops listening to WebSocket events.  Effectively a wrapper to [`WebSocket.addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#events) that also un-tracks removed listeners so they are no longer re-added when reconnecting.
	- **arguments**
		- **`type`** (**required**, `string`): Event type.  See documentation for [WebSocket events](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#events).
		- **`listener`** (**required**, `(e: Event) => void`): Event listener.  See documentation for [WebSocket events](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#events).
- **`addMessageListener(type: string, listener(e: Event) => void): void`**: Listens to WebSocket message events of a certain type.  Type is not part of WebSocket standard, and is a feature in Websocket Assistant.
	- **arguments**
		- **`type`** (**required**, `string`): Message type.
		- **`listener`** (**required**, `(data: any) => void`): Message listener.
	- **TypeScript**
		- `type` and `data` in listener are defined by the interface passed into the generic on `WSAssistantClient`.
- **`removeMessageListener(type: string, listener(e: Event) => void): void`**: Stops listening to WebSocket message events of a certain type.  Type is not part of WebSocket standard, and is a feature in Websocket Assistant.
	- **arguments**
		- **`type`** (**required**, `string`): Message type.
		- **`listener`** (**required**, `(data: any) => void`): Message listener.
	- **TypeScript**
		- `type` and `data` in listener are defined by the interface passed into the generic on `WSAssistantClient`.

#### TypeScript

`WSAssistantClient` takes a single generic component.  It should be an interface that maps message types to the data they send and receive.
