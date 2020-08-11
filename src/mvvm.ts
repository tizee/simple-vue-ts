import Compiler from './compiler';
import CompileMethods from './compile';
import { Observer } from './observer';

export type Methods = { [key: string]: (this: any, ...args: any[]) => any };
export type VMElem = Element | string;
export type Data = object;

// a minimal set of options
interface Options {
  el: VMElem;
  data: Data;
  methods: Methods;
}

// a simple MVVM component
class MVVM {
  readonly compiler: Compiler;
  readonly observer: Observer;
  readonly $el: VMElem;
  readonly $data: Data;
  readonly $options: Options;
  constructor(options: Options) {
    console.log('init mvvm');
    this.$el = options.el;
    this.$data = options.data;
    this.$options = options;
    this.compiler = new Compiler(this.$el, this);
    this.observer = new Observer(this.$data);
  }
  getVal(expression: string) {
    return CompileMethods.getValInDelimiter(expression, this);
  }
}

export default MVVM;
