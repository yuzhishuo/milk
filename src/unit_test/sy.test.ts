import 'reflect-metadata';

function readonly(target, key, descriptor) {
    descriptor.writable = false;
}

function enumerable(value) {
  return function (target, key, descriptor) {
     descriptor.enumerable = value;
  }
}

class C {
    @readonly
    @enumerable(false)
    method() { }
  }
  
function Path_1(target:any) {
    console.log(`I am class decorator:\n ${target} \n\n`)
}

@Path_1
class HelloService_1 {}

let _1 = new HelloService_1();


function Path(path: string) {
    return function (target: Function) {
        Reflect.defineMetadata("path", path, target);
    };
}

@Path('/hello')
class HelloService {
    constructor() {}
}

console.log(Reflect.getMetadata("path", HelloService))
