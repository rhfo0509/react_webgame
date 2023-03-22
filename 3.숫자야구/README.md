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

---

### 리액트 반복문(map)에서의 key의 역할

리액트는 key를 보고 같은 컴포넌트인지 아닌지 판단한다.

* key가 index로 설정되어있을 경우 문제점

```
<ul>
  {[
    { fruit: '사과', taste: '맛있다' },
    { fruit: '배', taste: '맛있다' },
    { fruit: '귤'. taste: '맛있다' },
  ]}.map((item, index) => {
    return {
      <li key={index}><b>{item.fruit}</b> - {item.taste}</li>
    }
  })
</ul>
```

배열의 제일 끝에 컴포넌트를 추가하는 경우 문제가 되지 않는다.
하지만 배열의 앞이나 중간에 컴포넌트를 추가하거나, 삭제되는 경우 index 값이 재설정되게 된다.
key 값을 index로 설정하였기 때문에 리액트는 "key가 바뀌었네?" -> "다른 컴포넌트겠구나!" 라고 생각하여
실제로는 동일한 데이터임에도 불구하고 리렌더링이 되어버리는 현상이 발생한다.

* key가 item 자체로 설정되어있을 경우 문제점
```
<ul>
  {[
    { fruit: '사과', taste: '맛있다' },
    { fruit: '배', taste: '맛있다' },
    { fruit: '귤'. taste: '맛있다' },
  ]}.map((item, index) => {
    return {
      <li key={item}><b>{item.fruit}</b> - {item.taste}</li>
    }
  })
</ul>
```

객체 자체로는 unique하지만, key는 "문자열" 형식이다. 즉, 서로 다른 객체라도 `[object Object]` 라는 같은 문자열 형식으로 변환이 된다는 것이다.
따라서 동일한 키가 2개 이상 올 수 없다는 react key의 원칙에 위배가 되어 에러가 발생하게 된다.

---

### lazy initialization

Lazy initailize는 useState를 사용하여 state를 초기화하는 과정을 lazy(게으르게)하게 실행하는 것이다.
1. setState()에 인수로 함수를 값으로 넘겨준다.
2. setState(함수)이 진행되면 최초 초기화 진행 과정에서 함수을 실행하게 된다.
3. 이후 업데이트(리렌더링 과정)에서 초기화가 진행되지 않기 때문에 함수을 실행하는 부분이 생략된다.
이와 같이 lazy initialize는 초기값 계산에 많은 비용(연산 시간, 메모리 등)이 소요될 때 비효율적인 부분을 최적화하는데 사용할 수 있다.

`useState(heavyWork())` : 함수를 우선 실행한 다음 초기화여부를 논의<br />
`useState(heavyWork)` : 초기화할지 비교하고 필요하면 그 때 함수를 실행

따라서 getNumbers 함수처럼 처음 초기화할때만 실행하고 싶은 경우, `useState(heavyWork)` 형태를 사용하는 것이 좋다.
그러나 `useState(...)`에서만 함수 형태를 넣고, `setSomething(...)`과 같은 형태에서는 함수 대신 함수의 반환값을 넣도록 한다.

---

### shouldComponentUpdate
class 컴포넌트에서 사용 - `return true`면 리렌더링, `return false`면 렌더링되지 않는다.

```
shouldComponentUpdate(nextProps, nextState, nextContext) {
  if (this.state.counter !== nextState.counter) {
    return true;
  }
  return false;
}
```

### PureComponent
클래스 컴포넌트에서, state와 props를 <b>얕은 비교</b>하여 변경된 내용이 있을 때만 리렌더링 + 자식 컴포넌트 리렌더링 방지

> <b>깊은 비교(deep comparison) vs 얕은 비교(shallow comparison)</b>
깊은 비교는 숫자나 문자열 같은 원시 자료형은 값을 비교하고, array나 function과 같은 object는 그 안에 들어있는 값을 일일이 확인한다.
얕은 비교는 이에 반해 object들의 레퍼런스 체크(참조하고 있는 객체가 같은지)만 한다.

아래 코드 같은 경우 `this.setState({ array: array })`의 두 array의 참조하는 객체가 같기 때문에 렌더링되지 않는다.
```
import React, { PureComponent } from 'react';

class Test extends PureComponent {
  state = {
    counter: 0,
    greeting: 'hello',
    boolean: true,
    array: [],
    object: {},
  };

  onClick = () => {
    const array = this.state.array;
    array.push(3);
    this.setState({
      array: array,
    })
  }

  render() {
    return (
      <div>
        <button onClick={this.onClick}>클릭!</button>
      </div>
    )
  }
}
```

`this.setState({ array: [...this.state,array, 3]})` 처럼 <b>spread syntax</b>를 이용해 
옛날 배열을 가져오는 대신 새로운 배열을 만들면 변화를 감지해 렌더링이 된다.

---

### React.memo

함수 컴포넌트에서, 자식 컴포넌트가 리렌더링되는 경우
1. state가 바뀌었을 때
2. props가 바뀌었을 때
3. 부모 컴포넌트가 렌더링되었을 때

자식 컴포넌트에 달라진 변화가 없는 데, <b>3번</b>의 경우 때문에 렌더링되는 경우를 막기 위해 함수 컴포넌트를 `memo(함수 컴포넌트)`로 감싸준다.
`컴포넌트.displayName = 컴포넌트명`으로 컴포넌트 이름을 다시 원래대로 되돌릴 수 있다.

---

