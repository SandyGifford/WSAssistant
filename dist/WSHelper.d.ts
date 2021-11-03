/// <reference types="node" />
export interface WSLike {
    send(data: string): void;
    addEventListener(type: string, listener: (e: {
        data: string | Buffer | ArrayBuffer | Buffer[];
    }) => void): any;
    removeEventListener(type: string, listener: (e: {
        data: string | Buffer | ArrayBuffer | Buffer[];
    }) => void): any;
}
export declare type WSEventType = "message" | "open" | "close" | "error";
declare type SelectProps<Base, Condition> = {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};
declare type SelectNames<Base, Condition> = SelectProps<Base, Condition>[keyof Base];
declare type SelectSubType<Base, Condition> = Pick<Base, SelectNames<Base, Condition>>;
declare type ExcludeProps<Base, Condition> = {
    [Key in keyof Base]: Base[Key] extends Condition ? never : Key;
};
declare type ExcludeNames<Base, Condition> = ExcludeProps<Base, Condition>[keyof Base];
declare type ExcludeSubType<Base, Condition> = Pick<Base, ExcludeNames<Base, Condition>>;
export declare abstract class WSHelper<M> {
    abstract send<T extends keyof SelectSubType<M, void>>(type: T): void;
    abstract send<T extends keyof ExcludeSubType<M, void>>(type: T, data: M[T]): void;
    abstract send<T extends keyof M>(type: T, data?: M[T]): void;
    addMessageListener<T extends keyof SelectSubType<M, void>>(type: T, listener: () => void): void;
    addMessageListener<T extends keyof ExcludeSubType<M, void>>(type: T, listener: (data: M[T]) => void): void;
    removeMessageListener<T extends keyof SelectSubType<M, void>>(type: T, listener: () => void): void;
    removeMessageListener<T extends keyof ExcludeSubType<M, void>>(type: T, listener: (data: M[T]) => void): void;
    abstract addEventListener(type: WSEventType, callback: (e: any) => void): void;
    abstract removeEventListener(type: WSEventType, callback: (e: any) => void): void;
}
export {};
