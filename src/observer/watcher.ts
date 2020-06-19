import Dep from './dep';
import { SimpleSet } from '../../typings';
// uid shared among Watchers
let uid = 0;
/**
 * Expression dependencies watcher
 * which publishs update callback when expression value changes.
 */
export default class Watcher {
  id: number;
  expression: string;
  deps: Array<Dep>;
  depsId: SimpleSet;

  constructor(expression: string) {
    this.id = uid++;
    this.expression = expression;
    this.deps = [];
    this.depsId = new Set();
  }

  // add dependency to current directive
  addDep(dep: Dep): void {
    const id = dep.id;
    if (!this.depsId.has(id)) {
      this.deps.push(dep);
      this.depsId.add(id);
    }
  }

  // publish to subscribers
  update(): void {
    console.log('wathcer update');
  }
}
