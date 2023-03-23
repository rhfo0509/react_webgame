
### 알아두어야 할 점
* 보통 반복문을 기점으로 컴포넌트를 분리함
* 제일 마지막에 있는 자식 컴포넌트는 PureComponent (데이터를 담고 있기 보다는 주로 화면에 표시되는 컴포넌트이기 때문)
* state를 쓰지 않는 함수는 컴포넌트 밖으로 분리하는 것이 좋음
* 부모 컴포넌트가 제거되면 자식 컴포넌트도 제거된다. 부모 컴포넌트를 제거할 때 자식 컴포넌트의 <b>componentDidMount</b> 부분에 있는 `setTimeout`이나 `setInterval` 부분은 같이 제거가 되지 않기 때문에 <b>componentWillUnmount</b> 부분에서 타이머 제거가 필요하다.

---

### ComponentDidUpdate
업데이트하고 싶은 상황을 잘 처리해야 한다. (기본적으로 렌더링시마다 매번 실행되므로 조건 설정이 중요)

```
componentDidUpdate(prevProps, prevState) {
  if (!this.state.winBalls.length) {
    this.runTimeouts();
  }
}
```
위 코드처럼 if문으로 조건을 설정하지 않으면 setState가 될 때마다 `this.runTimeouts()`가 매번 실행되어 공이 무한 증식되어 버리는 현상이 발생한다.

#### Hooks에서 ComponentDidUpdate만 수행하고 싶은 경우 (ComponentDidMount X)
mounted 변수를 통한 약간의 꼼수를 이용한다. 

```
const mounted = useRef(false);
useEffect(() => {
  if (!mounted.current) {
    mounted.current = true;
  } else {
    // AJAX 요청
  }
}, [바뀌는 값]);
```
이렇게 되면 ComponentDidMount의 경우 useEffect가 실행이 되지 않고, ComponentDidUpdate 시에만 ajax 요청을 할 수 있도록 활용이 가능하다.

---

### Hooks에서 렌더링될 때마다 getWinNumbers가 다시 실행되는 문제
`const [winNumbers, setWinNumbers] = useState(getWinNumbers())`에서 getWinNumbers 함수가 렌더링될 때마다 실행되고 있다.<br>

![image](https://user-images.githubusercontent.com/85874042/226830301-ab8c9462-b2d6-417e-a72b-8193b7ad96b6.png)

이유는, class 컴포넌트의 경우, 렌더링 시 render() 함수만 실행되는 반면 hooks의 경우, 렌더링 시 컴포넌트 전체가 실행되기 때문이다. 위 사진을 보면 매 함수 호출마다 새로운 결괏값을 리턴하는 것을 알 수 있다. 최초 결괏값(위 사진에서는 12, 15, 26, 32, 36, 44, 19)만 필요한 경우, 불필요한 함수 호출을 <b>React.useMemo()</b> 을 통해 막을 수 있다.

#### useMemo

useMemo : 일반 값을 기억하는 useRef와 달리 복잡한 함수 결괏값을 기억한다.

(1)`const lottoNumbers = useMemo(() => getWinNumbers(), [])`<br>
(2)`const [winNumbers, setWinNumbers] = useState(lottoNumbers)`<br>
(3)`const [winBalls, setWinBalls] = useState([])`

* dependency가 빈 배열인 경우

![image](https://user-images.githubusercontent.com/85874042/226836742-0174ca1b-0239-4ab1-9daa-f05b22c5b359.png)

최초 getWinNumbers 함수 실행 후 더 이상 실행되지 않는 것을 확인할 수 있다.

* dependency에 winNumbers가 들어있는 경우

첫 번째 사진과 같이 getWinNumbers 함수가 렌더링될 때마다 실행되고 있다.
단, dependency에 winNumbers를 넣기 위해, (3)이 (1)과 (2) 앞에 위치해야 한다는 점을 기억하자.

##### Hooks는 순서가 중요하다.

Hooks를 조건문 안에 절대 넣으면 안되고, 함수(useEffect, useCallback, useMemo 등)나 반복문 안에서도 useState를 쓰는 것을 지양하도록 한다.
Hooks는 최상위로 빼서 순서가 변하는 일이 없도록 해야한다.

#### useCallback

useCallback : 함수 자체를 기억한다.

자식 컴포넌트에 함수를 넘길 경우 useCallback 사용 필수! -> 부모가 매번 새로운 함수(props)를 전달한다고 생각하기 때문이다. (쓸데없이 리렌더링되는 문제)

useCallback의 dependency 배열이 빈 배열인 경우, 기억을 너무 잘해서 최초의 state 값만 반영됨, useCallback의 두 번째 배열에 state 값을 넣어주면 바뀐 state값이 정상 반영됨.
