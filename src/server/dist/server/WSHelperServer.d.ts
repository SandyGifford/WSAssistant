import { SelectSubType, ExcludeSubType } from "../base/internalTypings";
import NodeWebSocket from "ws";
import { WSEventType, WSHelper } from "../base/WSHelper";
export declare class WSHelperServer<M> extends WSHelper<M> {
    get ws(): NodeWebSocket | null;
    private _ws;
    constructor(ws: NodeWebSocket);
    send: <T extends keyof M>(type: T, data?: M[T] | undefined) => void;
    close: () => void;
    addEventListener: <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void) => void;
    removeEventListener: <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void) => void;
}
export declare class WSSHelperServer<M> extends WSHelper<M> {
    get wss(): NodeWebSocket.Server;
    private _wss;
    private clients;
    private ID_KEY;
    constructor(port: number);
    sendToAll<T extends keyof SelectSubType<M, void>>(type: T): void;
    sendToAll<T extends keyof ExcludeSubType<M, void>>(type: T, data: M[T]): void;
    sendToAllExcept<T extends keyof SelectSubType<M, void>>(type: T, skip: WSHelperServer<M>[]): void;
    sendToAllExcept<T extends keyof ExcludeSubType<M, void>>(type: T, skip: WSHelperServer<M>[], data: M[T]): void;
    send: () => never;
    close: () => void;
    addEventListener: <T extends WSEventType>(type: T, callback: (client: WSHelperServer<M>, e: WebSocketEventMap[T]) => void) => void;
    removeEventListener: <T extends WSEventType>(type: T, callback: (client: WSHelperServer<M>, e: WebSocketEventMap[T]) => void) => void;
    onConnected: (callback: (client: WSHelperServer<M>, ip: string) => void) => void;
    onDisconnected: (callback: () => void) => void;
    private forEachClient;
    private setWSId;
    private getWSId;
}
