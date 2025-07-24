/**
 * [K in keyof T] : T로 받은 타입의 key 값을 key 값으로 설정
 * (value: T[K], values: T[K]) => string : T[K]로 T의 value값을 파라미터로 받음
 */
export type ValidationType<T> = {
  [K in keyof T]: (value: T[K], values?: T) => string;
};
