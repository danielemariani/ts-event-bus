import { uid } from 'uid/single';

import { DispatchedEvent, DispatchRequest, EventsDeclarations, EventTypes, ListenerId, ListenRequest, EventBus, EventListener, RegisteredListeners } from '../EventBus';

class InMemoryEventBus<Declarations extends EventsDeclarations> implements EventBus<Declarations> {
  private events: Array<DispatchedEvent<Declarations, EventTypes<Declarations>>> = [];
  private listeners: RegisteredListeners<Declarations> = {} as RegisteredListeners<Declarations>;

  dispatch<T extends EventTypes<Declarations>>(request: DispatchRequest<Declarations, T>): void {
    const dispatchedEvent: DispatchedEvent<Declarations, T> = { ...request.event, timestamp: Date.now().toString() };
    const listeners = this.listeners[request.event.type] || [];

    this.events.push(dispatchedEvent);

    listeners.forEach(l => new Promise(() => l.listener(dispatchedEvent)).catch(() => {}));
  }

  registerToEvent<T extends EventTypes<Declarations>>(request: ListenRequest<Declarations, T>): ListenerId {
    if (!this.listeners[request.event]) {
      this.listeners[request.event] = [];
    }

    const listenerId = uid();

    this.listeners[request.event].push({ id: listenerId, listener: request.listener });

    if (request.options && request.options.recoverPreviousEvents) {
      this.events.filter(e => e.type === request.event)
        .forEach((e: DispatchedEvent<Declarations, T>) => this.dispatchAndCatchExceptions(request, e));
    }

    return listenerId;
  }

  private dispatchAndCatchExceptions<T extends EventTypes<Declarations>>(request: ListenRequest<Declarations, T>, e: DispatchedEvent<Declarations, T>) {
    return new Promise(() => request.listener(e)).catch(() => {});
  }

  unregisterListener<T extends EventTypes<Declarations>>(listenerId: ListenerId): void {
    Object.keys(this.listeners).forEach((key: EventTypes<Declarations>) => {
      this.listeners[key] = this.listeners[key].filter(entry => entry.id !== listenerId);
    })
  }
}

export const createInMemoryEventBus = <Declarations extends EventsDeclarations>() => {
  return new InMemoryEventBus<Declarations>();
};
