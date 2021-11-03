import { WSHelper } from "./WSHelper";
export declare type WSClientEventType = "open" | "close" | "error";
export declare class WSHelperClient<M> extends WSHelper<M> {
    private url;
    private retryMS;
    protected ws: WebSocket | null;
    private listeners;
    constructor(url: string, retryMS?: number);
    open: () => void;
    close: () => void;
    addEventListener<T extends WSClientEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void): void;
    removeEventListener<T extends WSClientEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void): void;
}
