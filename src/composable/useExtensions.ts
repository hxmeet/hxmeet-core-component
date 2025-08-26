import { shallowRef, type Ref, type Component, isRef } from 'vue';
import {createLogger} from "../helper/logger";

const log = createLogger('HxMeet:Extensions')

export type HxComponentDescriptor = { component: Component; props?: Record<string, any> };
type ExtensionValue = Ref<string> | HxComponentDescriptor;
type ExtensionMap = Map<string, ExtensionValue>;
const extensions: ExtensionMap = new Map();

export function useExtensions() {

  const set = (name: string, item: string | Ref | HxComponentDescriptor) => {
    if (typeof item === 'string') {
      log.info("Set extension (type: string)", name, item)
      extensions.set(name, shallowRef<string>(item));
    } else if (isRef(item)) {
      log.info("Set extension (type: Ref)", name, item)
      extensions.set(name, item as Ref);
    } else {
      log.info("Set extension (type: ComponentDescriptor)", name, item)
      extensions.set(name, item as HxComponentDescriptor);
    }
  }

  const get = (name: string): ExtensionValue | undefined => {
    return extensions.get(name);
  }

  return {
    extensions,
    get,
    set
  };
}
