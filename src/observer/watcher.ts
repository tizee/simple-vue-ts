import Dep from './dep';
let id = 0;
/**
 * Expression dependencies watcher
 * invoke update callback when expression value changes.
 */
export default class Watcher {
  uid: number;
  expression: string;
  cb: Function;
  vm: any;
  oldVal: any;

  constructor(vm: any, expression: string, cb: Function) {
    this.uid = id++;
    this.vm = vm;
    this.expression = expression;
    this.cb = cb;
    this.oldVal = this.getOldVal();
  }

  getOldVal() {
    // add lock
    console.log('Watcher: get old value', this.expression, this.vm);
    Dep.target = this;
    const oldVal = this.vm.getVal(this.expression);
    // release lock
    Dep.target = null;
    return oldVal;
  }

  // publish to subscribers
  update(): void {
    // update only when value changes
    console.log('Watcher: update', this.expression);
    const newVal = this.vm.getVal(this.expression);
    if (newVal !== this.oldVal) {
      // update
      this.cb(newVal);
    }
  }
}
