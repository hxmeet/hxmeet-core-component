import {createLogger} from "../helper/logger";

const log = createLogger('HxMeet:Events')

export type HxEvent = 'status'
export type HxHandler = (payload?: any) => any | Promise<any>;
type EventMap = Map<HxEvent, Set<HxHandler>>;
const listeners: EventMap = new Map();

export function useEvents() {

  const on = (event: HxEvent, handler: HxHandler): void => {
    if (!listeners.has(event)) listeners.set(event, new Set());
    log.info("Register event handler", event)
    listeners.get(event)!.add(handler);
  }

  const off = (event: HxEvent, handler: HxHandler): void => {
    log.info("Unregister event handler", event)
    listeners.get(event)?.delete(handler);
  }

  const emit = (event: HxEvent, payload?: any): Promise<any> => {
    log.info("Emit event", { event, payload })
    const list = Array.from(listeners.get(event) ?? []);
    const results = list.map(h => Promise.resolve().then(() => h(payload)));
    return Promise.all(results);
  }

  return {
    on, off, emit
  };
}
