import { isPlainObject, isString } from 'lodash';
import day from 'dayjs';

type ClassNamesArg = string | string[] | { [key: string]: any } | undefined | null | boolean;

/**
 * merge classname
 * @returns
 */
export function cx(...args: ClassNamesArg[]): string {
  const length = args.length;
  let classNames: string[] = [];
  for (let i = 0; i < length; i++) {
    const v = args[i];
    if (!v) {
      continue;
    }
    if (isString(v)) {
      classNames.push(v as string);
    } else if (Array.isArray(v)) {
      classNames = classNames.concat(v);
    } else if (isPlainObject(v)) {
      Object.keys(v).forEach((k) => {
        if ((v as Record<string, any>)[k]) {
          classNames.push(k);
        }
      });
    } else {
      console.warn('arguments must be one of string/array/object.');
    }
  }
  return [...new Set(classNames)].join(' ');
}

export const tFormat = (t: number) => day(t).format('YYYY/MM/DD HH:mm:ss');
