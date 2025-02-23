import kebabcase from 'lodash.kebabcase';

export function slugifyStr(str: string) {
  return kebabcase(str);
}

export function slugifyAll(arr: string[]) {
  return arr.map(str => slugifyStr(str));
}
