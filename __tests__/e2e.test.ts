import { WSSAssistantServer } from "ws-assistant-server";
import { WSAssistantClient } from "ws-assistant-client";
import IsoWebSocket from "isomorphic-ws";

interface WSDataMap {
	stringToServer: string;
	numberToServer: number;
	stringToClient: string;
	numberToClient: number;
}

global.WebSocket = IsoWebSocket as any;

const WS_PORT = 3000;
const STRING_TO_SERVER_DATA = "string to server";
const STRING_TO_CLIENT_DATA = "string to client";
const NUMBER_TO_SERVER_DATA = 4;
const NUMBER_TO_CLIENT_DATA = 5;

test("e2e", async () => {
	const clientOpenListener = jest.fn();
	const clientCloseListener = jest.fn();

	// setup server
	const server = new WSSAssistantServer<WSDataMap>(WS_PORT);

	server.onConnected(client => {
		client.addMessageListener("stringToServer", data => {
			expect(data).toBe(STRING_TO_SERVER_DATA);
			client.send("stringToClient", STRING_TO_CLIENT_DATA);
		});
		client.addMessageListener("numberToServer", data => {
			expect(data).toBe(NUMBER_TO_SERVER_DATA);
			client.send("numberToClient", NUMBER_TO_CLIENT_DATA);
		});
	});


	// setup client
	const ws = new WSAssistantClient<WSDataMap>(`ws://localhost:${WS_PORT}/`);

	ws.addEventListener("open", clientOpenListener);
	ws.addEventListener("close", clientCloseListener);

	await ws.open();

	async function awaitMessage<T extends keyof WSDataMap>(messageType: T, expected: WSDataMap[T]): Promise<void> {
		return new Promise(resolve => {
			ws.addMessageListener(messageType, data => {
				expect(data).toBe(expected);
				resolve();
			});
		});
	}

	const promises = Promise.all([
		awaitMessage("stringToClient", STRING_TO_CLIENT_DATA),
		awaitMessage("numberToClient", NUMBER_TO_CLIENT_DATA),
	]);

	ws.send("stringToServer", STRING_TO_SERVER_DATA);
	ws.send("numberToServer", NUMBER_TO_SERVER_DATA);

	await promises;
	await ws.close();

	expect(clientOpenListener).toHaveBeenCalled();
	expect(clientCloseListener).toHaveBeenCalled();

	await server.close();
});
