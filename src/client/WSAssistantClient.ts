import { WSEventType, WSAssistant } from "../shared/WSAssistant";

export class WSAssistantClient<M> extends WSAssistant<M> {
	private ws: WebSocket | null = null;
	private listeners: Record<string, ((e: any) => void)[]> = {};

	constructor(private url: string, private retryMS = 1000) {
		super();
	}

	public send = <T extends keyof M>(type: T, data?: M[T]) => {
		if (!this.ws) return;
		this.ws.send(JSON.stringify({ type, data }));
	}

	public open = async (): Promise<void> => {
		if (this.ws) {
			// TODO: consider throwing an error here instead of all of this business
			const ws = this.ws;
			if (ws.readyState === ws.OPEN) return Promise.resolve();
			else return new Promise((resolve, reject) => {
				const closeListener = () => reject("connection was closed before open completed");
				const errorListener = e => reject(e);
				const openListener = () => {
					ws.removeEventListener("open", openListener);
					ws.removeEventListener("close", closeListener);
					ws.removeEventListener("error", errorListener);
					resolve();
				};
				
				ws.addEventListener("open", openListener);
				ws.addEventListener("close", closeListener);
				ws.addEventListener("error", errorListener);
			});
		}

		const ws = this.ws = new WebSocket(this.url);

		Object.keys(this.listeners).forEach(lType => {
			this.listeners[lType].forEach(listener => this.ws?.addEventListener(lType, listener));
		});

		ws.addEventListener("error", e => {
			setTimeout(() => {
				this.open();
			}, this.retryMS);
		});

		return new Promise(resolve => {
			ws.addEventListener("open", () => resolve());
		});
	};

	public close = async (): Promise<void> => {
		if (!this.ws) return Promise.resolve();
		const ws = this.ws;
		this.ws = null;

		ws.close();

		return new Promise(resolve => {
			ws.addEventListener("close", () => resolve());
		});
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
