import { SelectSubType, ExcludeSubType } from "../shared/internalTypings";
import { WSEventType, WSAssistant } from "../shared/WSAssistant";
import NodeWebSocket from "ws";
export declare class WSAssistantServer<M> extends WSAssistant<M> {
    get ws(): NodeWebSocket | null;
    private _ws;
    constructor(ws: NodeWebSocket);
    send: <T extends keyof M>(type: T, data?: M[T] | undefined) => void;
    close: () => void;
    addEventListener: <T extends WSEventType>(type: T, listener: (e: WebSocketEventMap[T]) => void) => void;
    removeEventListener: <T extends WSEventType>(type: T, listener: (e: WebSocketEventMap[T]) => void) => void;
}
export declare class WSSAssistantServer<M> extends WSAssistant<M> {
    get wss(): NodeWebSocket.Server;
    private _wss;
    private clients;
    private ID_KEY;
    constructor(port: number);
    sendToAll<T extends keyof SelectSubType<M, void>>(type: T): void;
    sendToAll<T extends keyof ExcludeSubType<M, void>>(type: T, data: M[T]): void;
    sendToAllExcept<T extends keyof SelectSubType<M, void>>(type: T, skip: WSAssistantServer<M>[]): void;
    sendToAllExcept<T extends keyof ExcludeSubType<M, void>>(type: T, skip: WSAssistantServer<M>[], data: M[T]): void;
    send: () => never;
    close: () => Promise<void>;
    addEventListener: <T extends WSEventType>(type: T, listener: (client: WSAssistantServer<M>, e: WebSocketEventMap[T]) => void) => void;
    removeEventListener: <T extends WSEventType>(type: T, listener: (client: WSAssistantServer<M>, e: WebSocketEventMap[T]) => void) => void;
    onConnected: (listener: (client: WSAssistantServer<M>, ip: string) => void) => void;
    onDisconnected: (listener: () => void) => void;
    private forEachClient;
    private setWSId;
    private getWSId;
}
//# sourceMappingURL=WSAssistantServer.d.ts.map