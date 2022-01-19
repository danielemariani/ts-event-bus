# ts-event-bus

## Install
npm i --save @danielemariani/ts-event-bus

## Usage

### Create an event bus given a set of defined events
Currently, the only available implementation is an "in memory" one.

```typescript
import { EventBus, createInMemoryEventBus } from '@danielemariani/ts-event-bus';

// Events are defined by name and payoad type
type MyDeclarations = {
  'event-name-1': undefined;
  'event-name-2': string;
  'event-name-3': { aProp: number };
};

const eventBus = createInMemoryEventBus();
```

### Register events listeners
```typescript
eventBus.registerToEvent({ event: 'event-name-1', listener: (e) => { /* ...Do whatever with the event... */ } });
eventBus.registerToEvent({ event: 'event-name-2', listener: (e) => { /* ...Do whatever with the event... */ } });
eventBus.registerToEvent({ event: 'event-name-3', listener: (e) => { /* ...Do whatever with the event... */ } });
```

### Dispatch (typed) events
```typescript
eventBus.dispatch({ event: { type: 'event-name-1', payload: undefined } });
eventBus.dispatch({ event: { type: 'event-name-2', payload: 'VALUE' } });
eventBus.dispatch({ event: { type: 'event-name-3', payload: { aProp: 12 } } });
```

### Unregister listeners
Listeners can be unregistered by id (returned by the register operation)
```typescript
const listenerId = eventBus.registerToEvent({ event: 'event-name-1', listener: (e) => { /* ...Do whatever with the event... */ } });
eventBus.unregisterListener(listenerId);
```

### Retrieve previous events
Listeners are called for all the events dispatched after the listener registration.
However, it is possible to replay previously dispatched events while registering a new listener.
```typescript
// Events dispatched after listener is registered
eventBus.dispatch({ event: { type: 'event-name-2', payload: 'VALUE_1' } });
eventBus.dispatch({ event: { type: 'event-name-2', payload: 'VALUE_2' } });
eventBus.registerToEvent({ event: 'event-name-2', listener: (e) => { /* ... */ } });
eventBus.dispatch({ event: { type: 'event-name-2', payload: 'VALUE_3' } }); // Only this event will be dispatched to the listener

// Recover previous events
eventBus.dispatch({ event: { type: 'event-name-2', payload: 'VALUE_1' } });
eventBus.dispatch({ event: { type: 'event-name-2', payload: 'VALUE_2' } });
eventBus.registerToEvent({ event: 'event-name-2', listener: (e) => { /* ... */ }, options: { recoverPreviousEvents: true } });
// Previous events are dispatched to the listener immediately after registration
eventBus.dispatch({ event: { type: 'event-name-2', payload: 'VALUE_3' } }); // This event will be also dispatched to the listener
```

### Callbacks
It is possible to provide callbacks while instantiating the EventBus, which will be fired upon listeners registration or after events dispatching.
Useful if you want to implement decorative logic around the bus operations (eg. logging).
```typescript
  const onListenerRegistered = td.function<(d: { event: TestEventTypes, listenerId: ListenerId }) => void>();
  const onEventDispatched = td.function<(d: { event: TestDispatchedEvent, listeners: Array<ListenerId> }) => void>();

  const eventBus = createTestBus({
    onListenerRegistered: (data) => console.log(`Listener "${ data.listenerId }" registered for event "${ data.event }"`),
    onEventDispatched: (data) => console.log(`Event "${ data.event }" dispatched to listeners "${ data.listeners.join(',') }"`),
  });
```

