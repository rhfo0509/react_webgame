### return 내부에 for문과 if문 작성하는 방법

즉시 실행 함수 이용: 함수 내부에서 for문과 if문을 사용할 수 있음을 이용, 잘 쓰이지는 않는다.

---

### ref

1. DOM 요소에 직접 접근하고 싶을때

* 클래스 컴포넌트의 경우

`<input ref={this.onRefInput} />` 처럼 DOM 요소에서 ref 속성 추가<br />
클래스의 프로퍼티로 `input` 추가<br />
`onRefInput = (c) => { this.input = c; }`을 클래스의 메서드로 추가<br />

위 세가지 과정 진행 시, input 프로퍼티에 DOM 요소가 연결되어, 예를 들어 `this.input.focus()`를 통해 input 요소에 포커스를 두게 할 수 있다.

또는
`<input ref={this.inputRef} />` 이후 `inputRef = createRef()`로 DOM 요소 연결이 가능하며, `this.input.current.focus()`로 포커스가 가능하다. input이 아닌 <b>input.current</b>에 DOM 요소가 담겨 있음을 유의한다.

  * 함수 컴포넌트의 경우
  `<input ref={inputRef} />` 이후 `const inputRef = useRef(initialValue)`로 DOM 요소 연결이 가능하며, `this.input.current.focus()`로 포커스가 가능하다.

2. 값이 변해도 리렌더링하지 않도록 하는 변수를 관리하고 싶을 때

* 클래스 컴포넌트의 경우

클래스의 "프로퍼티"로 변수를 만든다.

* 함수 컴포넌트의 경우

`useRef(initialValue)`를 이용하면 값이 변해도 렌더링되지 않는다.