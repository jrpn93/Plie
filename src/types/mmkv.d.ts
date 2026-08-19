declare module 'react-native-mmkv' {
  export type { MMKV, Configuration } from './lib/specs/MMKVFactory.nitro';
  export { createMMKV } from './lib/createMMKV/createMMKV';
  export { deleteMMKV } from './lib/deleteMMKV/deleteMMKV';
  export { existsMMKV } from './lib/existsMMKV/existsMMKV';
  export { useMMKV } from './lib/hooks/useMMKV';
  export { useMMKVBoolean } from './lib/hooks/useMMKVBoolean';
  export { useMMKVBuffer } from './lib/hooks/useMMKVBuffer';
  export { useMMKVNumber } from './lib/hooks/useMMKVNumber';
  export { useMMKVObject } from './lib/hooks/useMMKVObject';
  export { useMMKVString } from './lib/hooks/useMMKVString';
  export { useMMKVListener } from './lib/hooks/useMMKVListener';
  export { useMMKVKeys } from './lib/hooks/useMMKVKeys';
}