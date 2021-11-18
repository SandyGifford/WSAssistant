import { WSEventType, WSAssistant } from "../shared/WSAssistant";

export class WSAssistantClient<M> extends WSAssistant<M> {
	private ws: WebSocket | null;
	private listeners: Record<string, ((e: any) => void)[]> = {};

	constructor(private url: string, private retryMS = 1000) {
		super();
		this.ws = new WebSocket(url);
	}

	public send = <T extends keyof M>(type: T, data?: M[T]) => {
		if (!this.ws) return;
		this.ws.send(JSON.stringify({ type, data }));
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

	public addEventListener = <T extends WSEventType>(type: T, listener: (e: WebSocketEventMap[T]) => void): void => {
		if (!this.listeners[type]) this.listeners[type] = [];
		const listeners = this.listeners[type];
		if (listeners.indexOf(listener) === -1) listeners.push(listener);
		this.ws?.addEventListener(type, listener);
	}

	public removeEventListener = <T extends WSEventType>(type: T, listener: (e: WebSocketEventMap[T]) => void): void => {
		if (!this.listeners[type]) this.listeners[type] = [];
		const listeners = this.listeners[type];
		const index = listeners.indexOf(listener);
		if (index !== -1) listeners.splice(index, 1);
		this.ws?.removeEventListener(type, listener);
	}
}
