import { DispatchedEvent, DispatchRequest, EventsDeclarations, EventTypes, ListenerId, ListenRequest, EventBus } from '../EventBus';
export declare type EventBusOptions<Declarations extends EventsDeclarations> = {
    onEventDispatched: (d: {
        event: DispatchedEvent<Declarations, EventTypes<Declarations>>;
        listeners: Array<ListenerId>;
    }) => void;
    onListenerRegistered: (d: {
        event: EventTypes<Declarations>;
        listenerId: ListenerId;
    }) => void;
};
declare class InMemoryEventBus<Declarations extends EventsDeclarations> implements EventBus<Declarations> {
    private readonly options?;
    private readonly events;
    private readonly listeners;
    constructor(options?: EventBusOptions<Declarations>);
    dispatch<T extends EventTypes<Declarations>>(request: DispatchRequest<Declarations, T>): void;
    registerToEvent<T extends EventTypes<Declarations>>(request: ListenRequest<Declarations, T>): ListenerId;
    private dispatchAndCatchExceptions;
    unregisterListener<T extends EventTypes<Declarations>>(listenerId: ListenerId): void;
}
export declare const createInMemoryEventBus: <Declarations extends EventsDeclarations>(options?: EventBusOptions<Declarations> | undefined) => InMemoryEventBus<Declarations>;
export {};
