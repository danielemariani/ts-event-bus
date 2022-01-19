import * as td from 'testdouble';

import { createInMemoryEventBus } from './InMemoryEventBus';
import { EventListener, EventTypes, EventBus } from '../EventBus';

describe('InMemoryEventBus', () => {

  type TestDeclarations = {
    'test-event-1': undefined;
    'test-event-2': string;
    'test-event-3': { aProp: number };
  };

  it('dispatches event to registered listener with no payload', () => {
    const eventBus = createTestBus();
    const listener = createTestListener<'test-event-1'>();

    eventBus.registerToEvent({ event: 'test-event-1', listener: listener });
    eventBus.dispatch({ event: { type: 'test-event-1', payload: undefined } });

    td.verify(listener({ type: 'test-event-1', payload: undefined, timestamp: td.matchers.isA(String) }), { times: 1 });
  });

  it('dispatches event to registered listener with typed payload', () => {
    const eventBus = createTestBus();
    const listener1 = createTestListener<'test-event-1'>();
    const listener2 = createTestListener<'test-event-2'>();
    const listener3 = createTestListener<'test-event-3'>();

    eventBus.registerToEvent({ event: 'test-event-1', listener: listener1 });
    eventBus.registerToEvent({ event: 'test-event-2', listener: listener2 });
    eventBus.registerToEvent({ event: 'test-event-3', listener: listener3 });

    eventBus.dispatch({ event: { type: 'test-event-1', payload: undefined } });
    eventBus.dispatch({ event: { type: 'test-event-2', payload: 'A_PAYLOAD' } });
    eventBus.dispatch({ event: { type: 'test-event-3', payload: { aProp: 12 } } });

    td.verify(listener1({ type: 'test-event-1', payload: undefined, timestamp: td.matchers.isA(String) }), { times: 1 });
    td.verify(listener2({ type: 'test-event-2', payload: 'A_PAYLOAD', timestamp: td.matchers.isA(String) }), { times: 1 });
    td.verify(listener3({ type: 'test-event-3', payload: { aProp: 12 }, timestamp: td.matchers.isA(String) }), { times: 1 });
  });

  it('does not dispatch to listeners registered to other events', () => {
    const eventBus = createTestBus();
    const listener = createTestListener<'test-event-1'>();

    eventBus.registerToEvent({ event: 'test-event-1', listener: listener });
    eventBus.dispatch({ event: { type: 'test-event-2', payload: 'A_PAYLOAD' } });

    td.verify(listener(td.matchers.anything()), { times: 0 });
  });

  it('protects against errors thrown by event handlers', () => {
    const eventBus = createTestBus();
    const listenerWithError = createTestListener<'test-event-1'>();
    const listener = createTestListener<'test-event-1'>();

    td.when(listenerWithError(td.matchers.anything())).thenThrow(new Error('Listener error'));

    eventBus.registerToEvent({ event: 'test-event-1', listener: listenerWithError });
    eventBus.registerToEvent({ event: 'test-event-1', listener: listener });
    eventBus.dispatch({ event: { type: 'test-event-1', payload: undefined } });

    td.verify(listener(td.matchers.anything()), { times: 1 });
  });

  it('every listener is assigned a unique id (to handle handlers unregistering)', () => {
    const listenersCount = 100;
    const eventBus = createTestBus();

    const listeners = Array(listenersCount).fill('').map(() => createTestListener<'test-event-1'>());
    const listenersId = listeners.map(l => eventBus.registerToEvent({ event: 'test-event-1', listener: l }));

    expect(listenersId).toHaveLength(listenersCount);
    expectAllIdsAreUnique(listenersId);
  });

  it('keeps dispatching until listener is unregistered', () => {
    const eventBus = createTestBus();
    const listener1 = createTestListener<'test-event-1'>();
    const listener2 = createTestListener<'test-event-1'>();

    const listener1Id = eventBus.registerToEvent({ event: 'test-event-1', listener: listener1 });
    eventBus.registerToEvent({ event: 'test-event-1', listener: listener2 });

    eventBus.dispatch({ event: { type: 'test-event-1', payload: undefined } });
    eventBus.dispatch({ event: { type: 'test-event-1', payload: undefined } });
    eventBus.dispatch({ event: { type: 'test-event-1', payload: undefined } });
    eventBus.unregisterListener(listener1Id);
    eventBus.dispatch({ event: { type: 'test-event-1', payload: undefined } });

    td.verify(listener1(td.matchers.anything()), { times: 3 });
    td.verify(listener2(td.matchers.anything()), { times: 4 });
  });

  it('dispatches events after listener is registered', () => {
    const eventBus = createTestBus();
    const listener = createTestListener<'test-event-2'>();

    eventBus.dispatch({ event: { type: 'test-event-2', payload: 'FIRST' } });
    eventBus.dispatch({ event: { type: 'test-event-2', payload: 'SECOND' } });

    eventBus.registerToEvent({ event: 'test-event-2', listener: listener });

    eventBus.dispatch({ event: { type: 'test-event-2', payload: 'THIRD' } });
    eventBus.dispatch({ event: { type: 'test-event-2', payload: 'FOURTH' } });

    td.verify(listener({ type: 'test-event-2', payload: 'FIRST', timestamp: td.matchers.isA(String) }), { times: 0 });
    td.verify(listener({ type: 'test-event-2', payload: 'SECOND', timestamp: td.matchers.isA(String) }), { times: 0 });
    td.verify(listener({ type: 'test-event-2', payload: 'THIRD', timestamp: td.matchers.isA(String) }), { times: 1 });
    td.verify(listener({ type: 'test-event-2', payload: 'FOURTH', timestamp: td.matchers.isA(String) }), { times: 1 });
  });

  function createTestBus(): EventBus<TestDeclarations> {
    return createInMemoryEventBus<TestDeclarations>();
  }

  function createTestListener<Type extends EventTypes<TestDeclarations>>(): EventListener<TestDeclarations, Type> {
    return td.function<EventListener<TestDeclarations, Type>>();
  }

  function expectAllIdsAreUnique(listenersId: Array<string>) {
    return expect(listenersId.reduce((acc, curr) => {
      if (acc.includes(curr)) return acc;
      acc.push(curr);
      return acc;
    }, [] as Array<string>)).toHaveLength(listenersId.length);
  }
});
