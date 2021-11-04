import NodeWebSocket from "ws";
import { WSEventType, WSHelper } from "./WSHelper";

export class WSHelperServer<M> extends WSHelper<M> {
	public get ws(): NodeWebSocket | null { return this._ws; };
	private _ws: NodeWebSocket | null;

	constructor(ws: NodeWebSocket) {
		super();
		this._ws = ws;
	}

	public send = <T extends keyof M>(type: T, data?: M[T]) => {
		if (!this._ws) return;
		this._ws.send(JSON.stringify({ type, data }));
	}

	public close = (): void => {
		if (!this._ws) return;
		this._ws.close();
		this._ws = null;
	};

	public addEventListener = <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void): void => {
		(this._ws?.addEventListener as any)(type, callback);
	}

	public removeEventListener = <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void): void => {
		(this._ws?.removeEventListener as any)(type, callback);
	}
}

export class WSSHelperServer<M> extends WSHelper<M> {
	public get wss(): NodeWebSocket.Server { return this._wss; };
	private _wss: NodeWebSocket.Server;
	private clients: WSHelperServer<M>[] = [];

	constructor(port: number) {
		super();
		this._wss = new NodeWebSocket.Server({ port });

		this._wss.on("connection", ws => {
			const client = new WSHelperServer<M>(ws);
			client.addEventListener("close", () => {
				const index = this.clients.indexOf(client);
				if (index === -1) return;
				this.clients.splice(index, 1);
			});
			this.clients.push(client);
		});
	}

	public send = <T extends keyof M>(type: T, data?: M[T]) => {
		this.clients.forEach(client => client.send(type, data));
	}

	public close = (): void => {
		this._wss.close();
	};

	public addEventListener = <T extends WSEventType>(type: T, callback: (client: WSHelperServer<M>, e: WebSocketEventMap[T]) => void): void => {
		this.clients.forEach(client => client.addEventListener(type, e => callback(client, e)));
	}

	public removeEventListener = <T extends WSEventType>(type: T, callback: (client: WSHelperServer<M>, e: WebSocketEventMap[T]) => void): void => {
		this.clients.forEach(client => client.removeEventListener(type, e => callback(client, e)));
	}
}
