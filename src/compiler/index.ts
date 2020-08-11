import MVVM, { VMElem } from '../mvvm';
import DirectiveCompile from '../compile';
import CompileMethods from '../compile';

const isElem = (el: Element | Node): boolean => {
  return el.nodeType === 1;
};

const isDirective = (name: string) => /^(v-|@).+$/.test(name);
const isKebabStyle = (name: string) => /^v-.+$/.test(name);
const isShortStyle = (name: string) => /^@.+$/.test(name);
const isBindStyle = (name: string) => /^:.+$/.test(name);

// traverse the el tree
const toFrag = (el: Element): DocumentFragment | null => {
  if (!el) {
    return null;
  }
  // use DocumentFragment to prevent reflow/repaint
  let frag = new DocumentFragment();
  let childNode: Node;
  let childElem: Element | HTMLElement | null;
  // maybe we need DFS here
  while (el.firstChild) {
    // childElem = el.firstElementChild;
    childNode = el.firstChild;
    // if (childElem) {
    //   let childFrag = toFrag(childElem as HTMLElement);
    //   childNode.appendChild(childFrag as DocumentFragment);
    // }
    frag.appendChild(childNode);
  }
  return frag;
};

// a simple compiler that compiles tag with directives
class Compiler {
  el: Element | null;
  vm: MVVM;
  constructor(el: VMElem, vm: MVVM) {
    console.log('compiler init');
    this.vm = vm;
    console.log('vm data', this.vm.$data);
    console.log('elem', el);
    this.el = isElem(el as Element)
      ? (el as Element)
      : document.querySelector(el as string);
    const frag = toFrag(this.el as Element);
    this.compile(frag);
    if (frag && this.el) {
      this.el.appendChild(frag);
    }
  }

  compile(el: ChildNode | DocumentFragment | null) {
    if (!el) {
      throw new Error('Invalid element');
    }
    // compile children
    for (let index = 0; index < el.childNodes.length; index++) {
      const child = el.childNodes[index];
      if (isElem(child as Element)) {
        // element node
        this.compileElementNode(child as HTMLElement);
      } else {
        // text node
        this.compileTextNode(child as HTMLElement);
      }
      if (child.childNodes && child.childNodes.length) {
        console.log('compile child', child);
        this.compile(child);
      }
    }
  }

  compileElementNode(el: HTMLElement) {
    console.log('compile element node', el);
    const attrs = el.attributes;
    for (let index = 0; index < attrs.length; index++) {
      const { name, value } = attrs[index];
      console.log('attr:', name, value);
      if (isDirective(name)) {
        // v-xxx style directives
        if (isKebabStyle(name)) {
          const action = name.split('-')[1];
          // for directives like v-on:click
          const [actName, evName] = action.split(':');
          DirectiveCompile[actName](el, value, this.vm, evName);
        }
        // @-style directives
        if (isShortStyle(name)) {
          const event = name.split('@')[1];
          DirectiveCompile['on'](el, value, this.vm, event);
        }
        el.removeAttribute(name);
      } else if (isBindStyle(name)) {
        // :bind
        const attrName = name.split(':');
        DirectiveCompile['bind'](el, value, this.vm, attrName);
        el.removeAttribute(name);
      }
    }
  }
  compileTextNode(el: HTMLElement) {
    console.log('compile text node', el, el.textContent);
    DirectiveCompile['text'](el, el.textContent, this.vm);
  }
  getVal(expression: string) {
    console.log('compiler getVal');
    return CompileMethods.getVal(this.el, expression);
  }
}

export default Compiler;
