declare type EventName = string;
declare type EventPayload = any;
export declare type ListenerId = string;
export declare type EventToDispatch<Declarations extends EventsDeclarations, Type extends EventTypes<Declarations>> = {
    type: Type;
    payload: Declarations[Type];
};
export declare type DispatchedEvent<Declarations extends EventsDeclarations, Type extends EventTypes<Declarations>> = {
    timestamp: string;
    type: Type;
    payload: Declarations[Type];
};
export declare type EventsDeclarations = Record<EventName, EventPayload>;
export declare type EventTypes<Declarations extends EventsDeclarations> = keyof Declarations;
export declare type EventListener<Declarations extends EventsDeclarations, Types extends EventTypes<Declarations>> = (event: DispatchedEvent<Declarations, Types>) => void;
export declare type RegisteredListeners<Declarations extends EventsDeclarations> = Record<EventTypes<Declarations>, Array<{
    id: ListenerId;
    listener: EventListener<Declarations, EventTypes<Declarations>>;
}>>;
export declare type DispatchRequest<Declarations extends EventsDeclarations, Types extends EventTypes<Declarations>> = {
    event: EventToDispatch<Declarations, Types>;
};
export declare type ListenRequest<Declarations extends EventsDeclarations, Types extends EventTypes<Declarations>> = {
    event: Types;
    listener: EventListener<Declarations, Types>;
};
export interface EventBus<Declarations extends EventsDeclarations> {
    dispatch<T extends EventTypes<Declarations>>(request: DispatchRequest<Declarations, T>): void;
    registerToEvent<T extends EventTypes<Declarations>>(request: ListenRequest<Declarations, T>): ListenerId;
    unregisterListener<T extends EventTypes<Declarations>>(listenerId: ListenerId): void;
}
export {};
