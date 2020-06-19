// remove
export function remove(obj: any, val: any): void {
  if (obj && Array.isArray(obj)) {
    const idx = obj.findIndex(item => item === val);
    if (idx >= 0) {
      obj.splice(idx, 1);
    }
  } else if (obj && typeof obj === 'object') {
    const property = Object.getOwnPropertyDescriptor(
      obj as Record<string, unknown>,
      val
    );
    if (property && property.configurable === false) {
      // could not delete
      return;
    }
    // remove property
    if (property) {
      delete obj[val];
    }
  }
}
