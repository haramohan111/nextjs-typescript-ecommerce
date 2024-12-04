declare module 'cookie' {
    export function parse(cookieHeader: string): Record<string, string>;
    export function serialize(name: string, value: string, options?: any): string;
  }
  