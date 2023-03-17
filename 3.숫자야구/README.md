### CommonJS vs ES Module

* CommonJS 방식 (Node Module)

1. `module.exports` 키워드: 하나의 값(원시 타입, 함수, 객체)만 할당 가능
```
// circle.js
const { PI } = Math;

module.exports = {
  area(r) {
    return PI * r * r;
  },
  circumference(r) {
    return 2 * PI * r;
  }
}
```

2. `exports` 객체: 프로퍼티 또는 메소드를 여러 개 정의, require 시 circle 모듈이 객체로 반환됨
```
// circle.js
const { PI } = Math;

exports.area = (r) => PI * r * r;

exports.circumference = (r) => 2 * PI * r;
```

3. `require` 키워드
```
// app.js
const circle = require('./circle.js');

console.log(circle.area(4));
console.log(circle.circumference(10));
```

* ES Module 방식

1. `export` 키워드: import 시 각각의 모듈이 합쳐져 하나의 객체로 반환된다.
```
// lib.mjs
export const pi = Math.PI;

export function square(x) {
  return x * x;
}

export class Person {
  constructor(name) {
    this.name = name;
  }
}
```

하나의 객체로 구성하려면 아래와 같이 객체로 구성한다.

```
// lib.mjs
const pi = Math.PI;

function square(x) {
  return x * x;
}

class Person {
  constructor(name) {
    this.name = name;
  }
}


export { pi, square, Person };
```

2. `export default` 키워드: 모듈에서 하나만 export하려는 경우, 단 var, let, const는 사용할 수 없다.
```
// lib2.mjs
export default x => x * x;
```

3. `import` 키워드
```
// app.mjs
import { pi, square, Person } from './lib.mjs';
```

이름을 변경하여 import할 수 있다.

```
//app.mjs
import * as lib from './lib.mjs';
```

export default의 경우, { } 없이 임의의 이름으로 import한다.

```
//app.mjs
import square from './lib.mjs';
```


