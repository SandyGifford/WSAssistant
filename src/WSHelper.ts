export interface WSLike {
	send(data: string): void;
	addEventListener(type: string, listener: (e: {data: string | Buffer | ArrayBuffer | Buffer[]}) => void);
	removeEventListener(type: string, listener: (e: {data: string | Buffer | ArrayBuffer | Buffer[]}) => void);
}

export type WSEventType = "message" | "open" | "close" | "error";

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
	public abstract send<T extends keyof SelectSubType<M, void>>(type: T): void;
	public abstract send<T extends keyof ExcludeSubType<M, void>>(type: T, data: M[T]): void;
	public abstract send<T extends keyof M>(type: T, data?: M[T]): void;

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

	public abstract addEventListener(type: WSEventType, callback: (e: any) => void): void;
	public abstract removeEventListener(type: WSEventType, callback: (e: any) => void): void;
}
