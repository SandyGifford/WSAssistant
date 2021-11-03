export interface WSLike {
	send(data: string): void;
	addEventListener(type: string, listener: (e: {data: string}) => void);
	removeEventListener(type: string, listener: (e: {data: string}) => void);
}

type SelectProps<Base, Condition> = {
	[Key in keyof Base]: Base[Key] extends Condition ? Key : never
};

type SelectNames<Base, Condition> = SelectProps<Base, Condition>[keyof Base];

type SelectSubType<Base, Condition> = Pick<Base, SelectNames<Base, Condition>>;

type ExcludeProps<Base, Condition> = {
	[Key in keyof Base]: Base[Key] extends Condition ? never : Key
};

type ExcludeNames<Base, Condition> = ExcludeProps<Base, Condition>[keyof Base];

type ExcludeSubType<Base, Condition> = Pick<Base, ExcludeNames<Base, Condition>>;

export abstract class WSHelper<M> {
	protected ws: WSLike | null;

	constructor(ws: WSLike) {
		this.ws = ws;
		this.send = this.send.bind(this);
		this.addMessageListener = this.addMessageListener.bind(this);
		this.removeMessageListener = this.removeMessageListener.bind(this);
		this.addEventListener = this.addEventListener.bind(this);
		this.removeEventListener = this.removeEventListener.bind(this);
	}

	public send<T extends keyof SelectSubType<M, void>>(type: T): void;
	public send<T extends keyof ExcludeSubType<M, void>>(type: T, data: M[T]): void;
	public send<T extends keyof M>(type: T, data?: M[T]): void {
		if (!this.ws) return;
		this.ws.send(JSON.stringify({ type, data }));
	}

	public addMessageListener<T extends keyof SelectSubType<M, void>>(type: T, listener: () => void): void;
	public addMessageListener<T extends keyof ExcludeSubType<M, void>>(type: T, listener: (data: M[T]) => void): void;
	public addMessageListener<T extends keyof M>(type: T, listener: (data: M[T]) => void): void {
		this.addEventListener("message", e => {
			const message = JSON.parse(e.data) as {type: string, data: any};
			if (type === message.type) listener(message.data);
		});
	}

	public removeMessageListener<T extends keyof SelectSubType<M, void>>(type: T, listener: () => void): void;
	public removeMessageListener<T extends keyof ExcludeSubType<M, void>>(type: T, listener: (data: M[T]) => void): void;
	public removeMessageListener<T extends keyof M>(type: T, listener: (data: M[T]) => void): void {
		this.removeEventListener("message", e => {
			const message = JSON.parse(e.data) as {type: string, data: any};
			if (type === message.type) listener(message.data);
		});
	}

	public addEventListener(type: string, callback: (e: any) => void): void {
		if (!this.ws) return;
		this.ws.addEventListener(type, callback);
	}

	public removeEventListener(type: string, callback: (e: any) => void): void {
		if (!this.ws) return;
		this.ws.removeEventListener(type, callback);
	}
}
