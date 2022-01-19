import { DispatchRequest, EventsDeclarations, EventTypes, ListenerId, ListenRequest, EventBus } from '../EventBus';
declare class InMemoryEventBus<Declarations extends EventsDeclarations> implements EventBus<Declarations> {
    private events;
    private listeners;
    dispatch<T extends EventTypes<Declarations>>(request: DispatchRequest<Declarations, T>): void;
    registerToEvent<T extends EventTypes<Declarations>>(request: ListenRequest<Declarations, T>): ListenerId;
    unregisterListener<T extends EventTypes<Declarations>>(listenerId: ListenerId): void;
}
export declare const createInMemoryEventBus: <Declarations extends EventsDeclarations>() => InMemoryEventBus<Declarations>;
export {};
