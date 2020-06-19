import Dep from './dep';

export default class Observer {
  val: any;
  constructor(val: any) {
    this.val = val;
    if (Array.isArray(val)) {
      // do nothing
    } else {
      this.walk(val);
    }
  }

  walk(obj: Record<string, unknown>): void {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      this.defineReactive(obj, keys[i]);
    }
  }

  /**
   * Define a reactive  property on an Object
   */
  defineReactive(obj: Record<string, unknown>, key: string, val?: any): void {
    const dep = new Dep();
    const property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      // val is null or readonly property
      return;
    }
    const getter = property && property.get;
    const setter = property && property.set;

    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get: function reactiveGetter() {
        const value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          // add dep to global dep watcher
          // dep.depend();
        }
        return value;
      },
      set: function reactiveSetter(newVal: any) {
        const value = getter ? getter.call(obj) : val;
        if (newVal === value) {
          // do nothing
          return;
        }
        if (!setter) return;
        // update value
        setter.call(obj, newVal);
        // notify dependencies
        dep.notify();
      },
    });
  }
}
