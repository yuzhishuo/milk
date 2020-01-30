type ParamType<T> = T extends (...param: infer P) => any ? P : any;

type ParamType_t = ParamType<(n_1: number, n_2: string) => void>;

type ReturnType_T<T> = T extends (...args: any[]) => infer R ? R : any;

type ReturnType_t = ReturnType_T<(n_1: number) => string | number>


type ConstructorParameters_T<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any ? P : never;
type InstanceType_T<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R ? R : any;

// [string, number] -> string | number

type ElementOf<T> = T extends Array<infer E> ? E : never

type TTuple = [string, number];

type ToUnion = ElementOf<TTuple>; // string | number

/// or

type ATuple = [string, number];
type Res = ATuple[number];  // string | number

// string | number -> string & number

type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never; //extends 左边是联合类型，那么 TS 会把 extends 操作符左边的联合类型拆开做判断。

type Result = UnionToIntersection<string | number>; // string & number
type Result_1 = UnionToIntersection<never>  // {}
type Result_2 = UnionToIntersection<1 | 2>  // 1&2

// return last element from Union
/*
// invail
type UnionLastPop<U> = UnionToIntersection<U> extends { (a: infer A): void; } ? A : never;
type Result_3 = UnionLastPop<number | string>
*/
// prepend an element to a tuple.
type Prepend<U, T extends any[]> =
    ((a: U, ...r: T) => void) extends (...r: infer R) => void ? R : never;

type Result_4 = Prepend<[number, string], [number]>