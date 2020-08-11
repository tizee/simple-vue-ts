import Watcher from './watcher';
import { remove } from '../utils';
// uid shared among Deps
let uid = 0;
/**
 * A dependency notifier that subscribed by directives.
 */
export default class Dep {
  static target: Watcher | null; // all Dep instances share one target
  id: number;
  subs: Array<Watcher>;

  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  // add subscriber
  addSub(watcher: Watcher): void {
    this.subs.push(watcher);
  }

  // remove subscriber
  removeSub(watcher: Watcher): void {
    remove(this.subs, watcher);
  }

  // add to global denpendencies watcher
  depend(): void {
    // global dependencies watcher
    if (Dep.target) {
    }
  }

  // notify all related subscirber (ViewModal)
  notify(): void {
    const _subs = this.subs.slice();
    // sort by uid in ascending order
    _subs.sort((a, b) => a.uid - b.uid);
    for (let i = 0; i < _subs.length; i++) {
      _subs[i].update();
    }
  }
}
