import { WSHelper } from "./WSHelper";

export type WSClientEventType = "open" | "close" | "error";

export class WSHelperClient<M> extends WSHelper<M> {
	protected ws: WebSocket | null;
	private listeners: Record<string, ((e: any) => void)[]> = {};

	constructor(private url: string, private retryMS = 1000) {
		super(new WebSocket(url));
	}

	public open = (): void => {
		if (this.ws) return;
		this.ws = new WebSocket(this.url);
		Object.keys(this.listeners).forEach(lType => {
			this.listeners[lType].forEach(listener => this.ws?.addEventListener(lType, listener));
		});

		this.ws.addEventListener("open", () => {
			console.log(`Socket to ${this.url} connected`);
		});

		this.ws.addEventListener("close", e => {
			console.log(`Socket to ${this.url} is closed. Reconnect will be attempted in ${this.retryMS / 1000} second(s).`, e.reason);
			setTimeout(() => {
				this.open();
			}, this.retryMS);
		});

		this.ws.addEventListener("error", e => {
			console.error(`Socket to ${this.url} encountered error: `, (e as any).message, "Closing socket");
			this.close();
		});
	};

	public close = (): void => {
		if (!this.ws) return;
		this.ws.close();
		this.ws = null;
	};

	public addEventListener<T extends WSClientEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void): void {
		if (!this.listeners[type]) this.listeners[type] = [];
		const listeners = this.listeners[type];
		if (listeners.indexOf(callback) === -1) listeners.push(callback);
		super.addEventListener(type, callback);
	}

	public removeEventListener<T extends WSClientEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void): void {
		if (!this.listeners[type]) this.listeners[type] = [];
		const listeners = this.listeners[type];
		const index = listeners.indexOf(callback);
		if (index !== -1) listeners.splice(index, 1);
		super.removeEventListener(type, callback);
	}
}
