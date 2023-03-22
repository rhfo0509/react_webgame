### REACT lifecycle

* 클래스의 경우

1. <b>constructor</b>: 메서드를 바인딩하거나 state를 초기화하는 작업을 수행
2. <b>render</b>: render 함수를 통해 컴포넌트를 렌더링
3. <b>ref</b>: ref가 있는 경우 DOM에 ref를 달아줌
4. <b>componentDidMount</b>: 컴포넌트를 DOM에 달아준 후 최초 1번 실행, 주로 비동기 요청을 많이 한다.

(state/props가 바뀌는 경우)

5. <b>shouldComponentUpdate</b>: "true"인 경우에만 리렌더링이 된다.
6. <b>render</b>: render 함수를 통해 컴포넌트를 re렌더링
7. <b>componentDidUpdate</b>: 리렌더링 후에 매번 실행
8. <b>componentWillUnmount</b>: 부모 컴포넌트에 의해 자식 컴포넌트가 제거되기 직전에 수행, 주로 비동기 요청 정리를 많이 한다.

* Hooks의 경우

Hooks의 경우 lifecycle에 있지는 않지만, 흉내낼 수는 있다. (useEffect 역할)

```
useEffect(() => {
  interval.current = setInterval(changeHand, 100);
  
  return () => {
    clearInterval(interval.current);
  }
}, [imgCoord]);
```

useEffect 함수 자체는 `componentDidMount`, `componentDidUpdate` 역할을 대신한다. (1:1 대응은 아님)

useEffect 내 return 부분은 `componentWillUnmount` 역할을 대신하거나 (dependency가 빈 배열인 경우), dependency가 바뀌어서 effect가 달라져야할 때 (이전 effect clean-up) 실행된다.

위 코드 같은 경우 return 부분은 2번째 경우에 해당한다.

1. setInterval 실행 100ms 후 changeHand가 실행
2. changeHand 내부의 setImgCoord로 인해 imgCoord 변경
3. dependency 내 imgCoord가 변경되었음을 감지
4. 이전 effect clean-up 과정 수행 (clearInterval)
5. 2초 중지 후 `interval.current = setInterval(changeHand, 100)` 로 재할당

* dependency에 있는 요소가 바뀔 때마다 changeHand 메서드가 실행되고, setImgCoord에 의해 imgCoord의 state가 변경된다.
> <b>dependency 배열에 요소가 들어있지 않은 경우</b>, changeHand 메서드는 실행되고, setImgCoord에 의해 imgCoord가 state가 `rspCoord.바위->rspCoord.가위`로 바뀌는 것까지는 정상적으로 진행된다. 그러나, 다음 changeHand 메서드가 실행될 때 changeHand는 새롭게 업데이트되지 않은 채 초기 상태를 유지하게 되고, 이에 따라 changeHand 내부의 imageCoord도 첫 상태 그대로 가게 된다.

---

### 클로저 문제

* 정의 : 함수와 외부 변수와의 관계

```
// RSPClass.jsx
componentDidMount() {

  const { imgCoord } = this.state;  // 1
  console.log(imgCoord);

  this.interval = setInterval(() => {

    const { imgCoord } = this.state;  // 2
    console.log(imgCoord);

    if (imgCoord === rspCoords.바위) {
      this.setState({
        imgCoord: rspCoords.가위,
      });
    } else if (imgCoord === rspCoords.가위) {
      this.setState({
        imgCoord: rspCoords.보,
      });
    } else {
      this.setState({
        imgCoord: rspCoords.바위,
      });
    }
  }, 100);
}
```

1. setInterval 바깥에 imgCoord가 선언된 경우

> imgCoord는 ComponentDidMount 함수에 선언됨<br>
> setInterval 실행 시 내부 콜백 함수에서 imgCoord를 찾게 됨<br>
> 내부 콜백 함수에는 imgCoord가 없고 상위 스코프인 ComponentDidMount에서 imgCoord 발견<br>
> setInterval 호출 시점의 imgCoord 값은 내부 콜백 함수와 "클로저" 관계를 맺게 되어 값이 고정됨<br>
> 따라서 setInterval 후에 imgCoord의 state가 바위->가위로 변하더라도, 클로저 내의 변수 값은 고정이 되어있어 고정된 값을 계속 참조하게 된다.<br>
> 즉, 계속 `if (imgCoord === rspCoords.바위) { ... }` 부분만 실행되는 것이다. 

2. setInterval 콜백 함수 내에 imgCoord가 선언된 경우

> imgCoord는 내부 콜백 함수에 선언됨<br>
> setInterval 실행 시 내부 콜백 함수에서 imgCoord를 찾게 됨<br>
> 내부 콜백 함수서 imgCoord 발견<br>
> 이는 클로저 관계가 아니므로, setInterval 되는 순간마다 최신의 imgCoord 값을 가져오게 됨 -> 정상적인 실행

---

### React에서 많이 쓰는 고차함수 패턴

`<button id="rock" className="btn" onClick={() => this.onClickBtn("바위")}>바위</button>` -><br>
`<button id="rock" className="btn" onClick={this.onClickBtn("바위")}>바위</button>`

대신 onClickBtn 함수를 고차함수 패턴으로 선언한다.

`onClickBtn = (choice) => { ... }` -> `onClickBtn = (choice) => (e) => { ... }`

---

### useInterval Custom Hook

```
function useInterval(callback, delay) {

    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);

    return savedCallback.current;
}
```
사용 예시 : `useInterval(changeHand, isRunning ? 100 : null)`

1. useRef()를 통해 changeHand 콜백 함수를 savedCallback이라는 ref에 저장
2. delay가 null이 아닐 때는 `setInterval(changeHand, 100)` 실행
3. 버튼을 클릭하여 delay가 null로 변하면 useEffect에서 dependency의 delay 변화를 감지함
4. dependency 내 imgCoord가 변경되었음을 감지
5. 이전 effect clean-up 과정 수행 (clearInterval)
6. 2초 중지 후 `let id = setInterval(changeHand, 100)`으로 재할당

