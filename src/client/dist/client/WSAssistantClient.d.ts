import { WSEventType, WSAssistant } from "../shared/WSAssistant";
export declare class WSAssistantClient<M> extends WSAssistant<M> {
    private url;
    private retryMS;
    private ws;
    private listeners;
    constructor(url: string, retryMS?: number);
    send: <T extends keyof M>(type: T, data?: M[T] | undefined) => void;
    open: () => void;
    close: () => void;
    addEventListener: <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void) => void;
    removeEventListener: <T extends WSEventType>(type: T, callback: (e: WebSocketEventMap[T]) => void) => void;
}
//# sourceMappingURL=WSAssistantClient.d.ts.map