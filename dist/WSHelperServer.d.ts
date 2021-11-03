import NodeWebSocket from "ws";
import { WSEventType, WSHelper } from "./WSHelper";
export declare class WSHelperServer<M> extends WSHelper<M> {
    private ws;
    constructor(ws: NodeWebSocket);
    send: <T extends keyof M>(type: T, data?: M[T] | undefined) => void;
    close: () => void;
    addEventListener: <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void) => void;
    removeEventListener: <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void) => void;
}
export declare class WSSHelperServer<M> extends WSHelper<M> {
    private wss;
    private clients;
    constructor(port: number);
    on: NodeWebSocket.Server["on"];
    off: NodeWebSocket.Server["off"];
    send: <T extends keyof M>(type: T, data?: M[T] | undefined) => void;
    close: () => void;
    addEventListener: <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void) => void;
    removeEventListener: <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void) => void;
}
