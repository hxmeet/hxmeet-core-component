import { shallowRef, type Ref, type Component, isRef } from 'vue';

export type ComponentDescriptor = { component: Component; props?: Record<string, any> };
type ExtensionValue = Ref<string> | ComponentDescriptor;
type ExtensionMap = Map<string, ExtensionValue>;
const extensions: ExtensionMap = new Map();

export function useExtensions() {

  const set = (name: string, item: string | Ref | ComponentDescriptor) => {
    if (typeof item === 'string') {
      console.log("set (string)", name, item)
      extensions.set(name, shallowRef<string>(item));
    } else if (isRef(item)) {
      console.log("set (ref)", name, item)
      extensions.set(name, item as Ref);
    } else {
      console.log("set (comp-descriptor)", name, item)
      extensions.set(name, item as ComponentDescriptor);
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
