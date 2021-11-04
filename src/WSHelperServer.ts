import { SelectSubType, ExcludeSubType } from "./internalTypings";

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
		this._ws?.addEventListener(type as any, e => callback(e as any));
	}

	public removeEventListener = <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void): void => {
		this._ws?.removeEventListener(type as any, e => callback(e as any));
	}
}

export class WSSHelperServer<M> extends WSHelper<M> {
	public get wss(): NodeWebSocket.Server { return this._wss; };
	private _wss: NodeWebSocket.Server;
	private clients: Record<string, WSHelperServer<M>> = {};
	private ID_KEY = "WSHelperServerId";

	constructor(port: number) {
		super();
		this._wss = new NodeWebSocket.Server({ port });

		this._wss.on("connection", (ws, req) => {
			const id = req.headers["sec-websocket-key"] as string;
			this.setWSId(ws, id);

			const client = new WSHelperServer<M>(ws);
			this.clients[id] = client;

			client.addEventListener("close", () => delete this.clients[id]);
		});
	}

	public sendToAll<T extends keyof SelectSubType<M, void>>(type: T): void;
	public sendToAll<T extends keyof ExcludeSubType<M, void>>(type: T, data: M[T]): void;
	public sendToAll<T extends keyof M>(type: T, data?: M[T]): void {
		this.forEachClient(client => client.send(type, data));
	}

	public sendToAllExcept<T extends keyof SelectSubType<M, void>>(type: T, skip: WSHelperServer<M>[]): void;
	public sendToAllExcept<T extends keyof ExcludeSubType<M, void>>(type: T, skip: WSHelperServer<M>[], data: M[T]): void;
	public sendToAllExcept<T extends keyof M>(type: T, skip: WSHelperServer<M>[], data?: M[T]): void {
		const skipIds = skip.reduce((map, client) => {
			map[this.getWSId(client.ws as NodeWebSocket)] = true;
			return map;
		}, {} as Record<string, true>);

		this.forEachClient(client => {
			if (!skipIds[this.getWSId(client.ws as NodeWebSocket)]) client.send(type, data)
		});
	}

	public send = () => {
		throw new Error("send not supported in WSHelperServer, use sendToAll instead");
	}

	public close = (): void => {
		this._wss.close();
	};

	public addEventListener = <T extends WSEventType>(type: T, callback: (client: WSHelperServer<M>, e: WebSocketEventMap[T]) => void): void => {
		this.forEachClient(client => client.addEventListener(type, e => callback(client, e)));
	}

	public removeEventListener = <T extends WSEventType>(type: T, callback: (client: WSHelperServer<M>, e: WebSocketEventMap[T]) => void): void => {
		this.forEachClient(client => client.removeEventListener(type, e => callback(client, e)));
	}

	public onConnected = (callback: (client: WSHelperServer<M>, ip: string) => void): void => {
		this._wss.on("connection", (ws, req) => callback(this.clients[this.getWSId(ws)], req.socket.remoteAddress as string));
	}

	public onDisconnected = (callback: () => void): void => {
		this._wss.on("close", () => callback());
	}

	private forEachClient(callback: (client: WSHelperServer<M>, id: string) => void): void {
		Object.keys(this.clients).forEach(id => callback(this.clients[id], id));
	}

	private setWSId(ws: NodeWebSocket, id: string): void {
		(ws as any)[this.ID_KEY] = id;
	}

	private getWSId(ws: NodeWebSocket): string {
		return (ws as any)[this.ID_KEY];
	}
}
