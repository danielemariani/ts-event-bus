# ts-event-bus

## Install
npm i --save @danielemariani/ts-event-bus

## Usage

### Create an event bus given a set of defined events

```
import { EventBus, createInMemoryEventBus } from '@danielemariani/ts-event-bus';

// Events are defined by name and payoad type
type MyDeclarations = {
  'event-name-1': undefined;
  'event-name-2': string;
  'event-name-3': { aProp: number };
};

const eventBus = createInMemoryEventBus();

eventBus.registerToEvent({ event: 'event-name-1', listener: (e) => { /* ...Do whatever with the event... */ } });
eventBus.registerToEvent({ event: 'event-name-2', listener: (e) => { /* ...Do whatever with the event... */ } });
eventBus.registerToEvent({ event: 'event-name-3', listener: (e) => { /* ...Do whatever with the event... */ } });

eventBus.dispatch({ event: { type: 'event-name-1', payload: undefined } });
eventBus.dispatch({ event: { type: 'event-name-2', payload: 'VALUE' } });
eventBus.dispatch({ event: { type: 'event-name-3', payload: { aProp: 12 } } });
```
