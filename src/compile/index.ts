import { Watcher } from '../observer';

type CompileMethod = (
  el: HTMLElement,
  value: any,
  vm: any,
  attrName: string
) => any;

// value must be an expression or an empty expression
const defaultReExp = /\{\{(?:.|\r?\n)+?\}\}/g;

// v-text for text nodes have {{ }}
const vText: CompileMethod = (el: HTMLElement, exp: string, vm: any) => {
  console.log('v-text', el, exp);
  // for sake of simplicity, use {{ }} as delimiters
  let value;
  if (!defaultReExp.test(exp)) {
    console.log('v-text test:', defaultReExp.test(exp), exp);
    new Watcher(vm, exp, (newVal: any) => {
      updater.textUpdater(el, newVal);
    });
    value = getValInDelimiter(exp, vm);
  } else {
    console.log('v-text passed');
    value = exp.replace(/\{\{(.+?)\}\}/g, (val: string) => {
      new Watcher(vm, val, () => {
        console.log('run callback');
        updater.textUpdater(el, getValInDelimiter(exp, vm));
      });
      // use real value from vm's data source
      return (getValInDelimiter(val, vm) as unknown) as string;
    });
  }
  console.log('vText:', value);
  updater.textUpdater(el, value);
};

const vOn: CompileMethod = () => {};

const vModel: CompileMethod = () => {};

const vIf: CompileMethod = () => {};

const vHtml: CompileMethod = () => {};

const vBind: CompileMethod = () => {};

const getValInDelimiter = (expWithDelimiter: string, vm: any) =>
  expWithDelimiter.replace(/\{\{(.+?)\}\}/g, (...substring: any[]) => {
    console.log('getValInDelimiter', substring);
    console.log('call getVal');
    return (getVal(substring[1], vm) as unknown) as string;
  });

// get value of an expression using a viewmodal
const getVal = (exp: string, vm: any) => {
  // a.b.c -> ['a','b','c'];
  console.log('getVal:', exp);
  console.log('split:', exp.split('.'));
  const res = exp.split('.').reduce((val: Record<string, any>, cur: string) => {
    console.log('getVal reduce:', cur);
    return val[cur];
  }, vm.$data);
  console.log('getVal resulte:', res);
  return res;
};
const setVal = (oldVal: string, newVal: any, vm: any) => {
  return oldVal
    .trim()
    .split('.')
    .reduce(
      (val: Record<string, any>, cur: string) => (val[cur] = newVal),
      vm.$data
    );
};

const updater = {
  textUpdater(node: HTMLElement, value: any) {
    node.textContent = value;
  },
  htmlUpdater(node: HTMLElement, value: any) {
    node.innerHTML = value;
  },
  modelUpdater(node: HTMLInputElement | HTMLSelectElement, value: any) {
    node.value = value;
  },
  bindUpdater(node: HTMLElement, attrName: string, value: any) {
    node.setAttribute(attrName, value);
  },
};
const CompileMethods: Record<string, any> = {
  getVal,
  getValInDelimiter,
  setVal,
  updater,
  on: vOn,
  text: vText,
  if: vIf,
  model: vModel,
  html: vHtml,
  bind: vBind,
};

export default CompileMethods;
