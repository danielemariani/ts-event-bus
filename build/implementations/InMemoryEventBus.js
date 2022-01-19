"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInMemoryEventBus = void 0;
const single_1 = require("uid/single");
class InMemoryEventBus {
    constructor(options) {
        this.events = [];
        this.listeners = {};
        this.options = options;
    }
    dispatch(request) {
        var _a;
        const dispatchedEvent = Object.assign(Object.assign({}, request.event), { timestamp: Date.now().toString() });
        const listeners = this.listeners[request.event.type] || [];
        this.events.push(dispatchedEvent);
        listeners.forEach(l => new Promise(() => l.listener(dispatchedEvent)).catch(() => { }));
        (_a = this.options) === null || _a === void 0 ? void 0 : _a.onEventDispatched({ event: dispatchedEvent, listeners: listeners.map(l => l.id) });
    }
    registerToEvent(request) {
        var _a;
        if (!this.listeners[request.event]) {
            this.listeners[request.event] = [];
        }
        const listenerId = (0, single_1.uid)();
        this.listeners[request.event].push({ id: listenerId, listener: request.listener });
        if (request.options && request.options.recoverPreviousEvents) {
            this.events.filter(e => e.type === request.event)
                .forEach((e) => this.dispatchAndCatchExceptions(request, e));
        }
        (_a = this.options) === null || _a === void 0 ? void 0 : _a.onListenerRegistered({ event: request.event, listenerId: listenerId });
        return listenerId;
    }
    dispatchAndCatchExceptions(request, e) {
        return new Promise(() => request.listener(e)).catch(() => { });
    }
    unregisterListener(listenerId) {
        Object.keys(this.listeners).forEach((key) => {
            this.listeners[key] = this.listeners[key].filter(entry => entry.id !== listenerId);
        });
    }
}
const createInMemoryEventBus = (options) => {
    return new InMemoryEventBus(options);
};
exports.createInMemoryEventBus = createInMemoryEventBus;
