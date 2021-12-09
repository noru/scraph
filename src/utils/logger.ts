/* eslint-disable @typescript-eslint/no-explicit-any */
export function Logger(tag: string) {
  return {
    e: gen(console.error, tag),
    w: gen(console.warn, tag),
    i: gen(console.info, tag),
    l: gen(console.log, tag),
    d: gen(console.debug, tag),
  }
}

type logFunc = (message?: any, ...optionalParams: any[]) => void;

function gen(logFunc: logFunc, tag: string): logFunc {
  return (...args: any[]) => {
    let [first, ...rest] = args
    if (typeof first === 'string') {
      logFunc(tag + ' ' + first, ...rest)
    } else {
      logFunc(tag, first, ...args)
    }
  }
}

export const defaultLogger = Logger('[scraph]')