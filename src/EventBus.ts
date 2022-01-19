type EventName = string;
type EventPayload = any;
export type ListenerId = string;

export type EventToDispatch<Declarations extends EventsDeclarations,
  Type extends EventTypes<Declarations>,
  > = {
  type: Type;
  payload: Declarations[Type];
};

export type DispatchedEvent<Declarations extends EventsDeclarations,
  Type extends EventTypes<Declarations>,
  > = {
  timestamp: string;
  type: Type;
  payload: Declarations[Type];
};

export type EventsDeclarations = Record<EventName, EventPayload>;
export type EventTypes<Declarations extends EventsDeclarations> = keyof Declarations;

export type EventListener<Declarations extends EventsDeclarations, Types extends EventTypes<Declarations>> =
  (event: DispatchedEvent<Declarations, Types>) => void;

export type RegisteredListeners<Declarations extends EventsDeclarations> = Record<EventTypes<Declarations>, Array<{ id: ListenerId, listener: EventListener<Declarations, EventTypes<Declarations>> }>>;

export type DispatchRequest<Declarations extends EventsDeclarations, Types extends EventTypes<Declarations>> = {
  event: EventToDispatch<Declarations, Types>;
};

export type ListenRequest<Declarations extends EventsDeclarations, Types extends EventTypes<Declarations>> = {
  event: Types;
  listener: EventListener<Declarations, Types>;
  options?: { recoverPreviousEvents?: boolean; };
};

export interface EventBus<Declarations extends EventsDeclarations> {
  dispatch<T extends EventTypes<Declarations>>(request: DispatchRequest<Declarations, T>): void;
  registerToEvent<T extends EventTypes<Declarations>>(request: ListenRequest<Declarations, T>): ListenerId;
  unregisterListener<T extends EventTypes<Declarations>>(listenerId: ListenerId): void;
}
