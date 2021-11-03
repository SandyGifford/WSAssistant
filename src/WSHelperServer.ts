import NodeWebSocket from "ws";
import { WSEventType, WSHelper } from "./WSHelper";

export class WSHelperServer<M> extends WSHelper<M> {
	private ws: NodeWebSocket | null;

	constructor(ws: NodeWebSocket) {
		super();
		this.ws = ws;
	}

	public send = <T extends keyof M>(type: T, data?: M[T]) => {
		if (!this.ws) return;
		this.ws.send(JSON.stringify({ type, data }));
	}

	public close = (): void => {
		if (!this.ws) return;
		this.ws.close();
		this.ws = null;
	};

	public addEventListener = <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void): void => {
		(this.ws?.addEventListener as any)(type, callback);
	}

	public removeEventListener = <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void): void => {
		(this.ws?.removeEventListener as any)(type, callback);
	}
}

export class WSSHelperServer<M> extends WSHelper<M> {
	private wss: NodeWebSocket.Server;
	private clients: WSHelperServer<M>[] = [];

	constructor(port: number) {
		super();
		this.wss = new NodeWebSocket.Server({ port });
		this.on = this.wss.on;
		this.off = this.wss.off;

		this.wss.on("connection", ws => {
			const client = new WSHelperServer<M>(ws);
			client.addEventListener("close", () => {
				const index = this.clients.indexOf(client);
				if (index === -1) return;
				this.clients.splice(index, 1);
			});
			this.clients.push(client);
		});
	}

	public on: NodeWebSocket.Server["on"];
	public off: NodeWebSocket.Server["off"];

	public send = <T extends keyof M>(type: T, data?: M[T]) => {
		this.clients.forEach(client => client.send(type, data));
	}

	public close = (): void => {
		this.wss.close();
	};

	public addEventListener = <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void): void => {
		this.clients.forEach(client => client.addEventListener(type, callback));
	}

	public removeEventListener = <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void): void => {
		this.clients.forEach(client => client.removeEventListener(type, callback));
	}
}
