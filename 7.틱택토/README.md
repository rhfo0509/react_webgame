### React에서의 불변성

```
const reducer = (state, action) => {
  switch (action.type) {
    ...
    case CLICK_CELL:
      console.log(CLICK_CELL);
      const tableData = [...state.tableData];
      tableData[action.row] = [...tableData[action.row]];
      tableData[action.row][action.cell] = state.turn;
      return {
        ...state,
        tableData,
        recentCell: [action.row, action.cell],
      };
    ...
  }
};
```

tableData 같은 경우 2차원 배열로 되어있는데, 기본적으로 객체의 state 값을 변경하기 위해서는 얕은 복사를 해줘야 한다.

`const a = { b: 1, c: 2 }` 인 경우, `const b = a` 로 설정하면 `b === a`가 true가 된다.
React에서 상태값을 업데이트 할 때 얕은 비교를 수행하는데, 즉 객체의 속성 하나하나를 비교하는게 아니라 참조값만 비교하여 상태를 업데이트하게 된다. 따라서 위와 같은 경우는 참조값이 같기 때문에 변한 게 없다고 판단하여 상태가 업데이트되지 않는다.

`const b = a` 대신 `const b = { ...a }` 인 경우 `b === a`가 false가 되어 상태가 업데이트된다.

---

### useReducer

* 참고할 만한 링크
https://velog.io/@iamhayoung/React-Hooks-useReducer%EC%97%90-%EB%8C%80%ED%95%B4-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0#3%EF%B8%8F%E2%83%A3-dispatch-%ED%95%A8%EC%88%98

* 사용 목적
state 업데이트 로직이 컴포넌트의 내부에 들어있는 useState와는 달리, 컴포넌트로부터 업데이트 로직을 분리할 수 있어 컴포넌트를 최적화시킬 수 있다는 장점이 있다. 또한 관리해야 할 state의 수가 많아지거나 복잡해질 경우 useReducer를 통해 한 번에 관리할 수 있다.

* 기본적인 형태
`const [state, dispatch] = useReducer(reducer, initialState[, init])`

1. dispatch 함수
`dispatch({ type: CLICK_CELL, row: rowIndex, cell: cellIndex })`<br>
dispatch 함수는 action 객체를 인수로 받으며, 바로 이어서 실행될 reducer 함수의 2번째 인수인 action 부분에 할당된다.

2. reducer 함수
```
const reducer = (state, action) => {
  switch (action.type) {
    ...
    case CLICK_CELL:
      console.log(CLICK_CELL);
      const tableData = [...state.tableData];
      tableData[action.row] = [...tableData[action.row]];
      tableData[action.row][action.cell] = state.turn;
      return {
        ...state,
        tableData,
        recentCell: [action.row, action.cell],
      };
    ...
  }
};
```
reducer 함수는 dispatch 함수에 의해 실행되며, 컴포넌트 외부에서 state를 업데이트하는 로직을 담당한다.<br>
현재 상태인 state와 dispatch 함수로부터 전달받은 action 객체를 인수로 받으며, 현재 상태 state 값을 action 객체에 들어있는 변경된 state 값으로 업데이트한다.

---

### 틱택토 실행 순서

1. 처음 실행 시 TicTacToe -> Table -> Tr -> Td 컴포넌트 순서로 렌더링 (이 때 useEffect는 실행되지 않음)
2. 셀 클릭 시 Td 컴포넌트의 onClickTd 함수 실행
3. type이 `CLICK_CELL`인 dispatch 함수 실행
4. reducer 함수가 곧바로 실행되어 tableData와 recentCell 값을 변경
5. 재렌더링이 일어날 때, 컴포넌트가 모두 렌더링되고 난 후, useEffect 함수를 실행한다. (useEffect 함수는 비동기 함수이기 때문이다.)
6. useEffect 함수에서 승리/무승부 검사 진행
7. 승리/무승부가 아닌 경우 type이 `CHANGE_TURN`인 dispatch 함수 실행
8. type이 `CHANGE_TURN`인 경우, tableData를 바꾸지 않기 때문에 Table 컴포넌트부터 렌더링되지 않는다. (Table 컴포넌트에 React.memo를 적용시켰기 때문인데, 만약 React.memo가 없다면 Table 컴포넌트가 렌더링이 될 것이다.)
9. 승리/무승부인 경우, type이 `SET_WINNER`와 `RESET_GAME`인 dispatch 함수 실행
10. 이 경우, `RESET_GAME` 부분에서 tableData를 초기값으로 변경하기 때문에 Table -> Tr -> Td가 렌더링이 되는 것을 확인할 수 있다.

---

### dispatch를 2개 이상 연속으로 작성할 경우 유의점

```
dispatch({ type: CLICK_CELL, row: rowIndex, cell: cellIndex });
dispatch({ type: CHANGE_TURN });
```

dispatch는 동기 함수이다.<br>
그러나 type이 `CLICK_CELL`인 dispatch 함수가 실행될 때 recentCell이 변경되어 useEffect가 실행되는데, 여기서 useEffect는 비동기 함수다.<br>
따라서 useEffect가 실행되기 전, type이 `CHANGE_TURN`인 dispatch 함수가 실행이 되어 useEffect에서 turn 비교시 "클릭한 당시의 turn"이 아닌 "클릭 이후 변경된 turn"으로 비교가 되어버리는 문제가 발생하게 된다.<br>
따라서 `dispatch({ type: CHANGE_TURN });` 부분을 useEffect 내의 turn 비교한 후에 실행되도록 함으로써 비동기 문제를 해결한다.

---

### React.memo vs useMemo

* React.memo : Higher-Order Components(HOC)
> <b>Higher-Order Components</b>: 컴포넌트를 인자로 받아 새로운 컴포넌트롤 다시 return해주는 함수

```
const Td = memo(({ rowIndex, cellIndex, cellData, dispatch }) => {
  console.log("td rendered");
  
  const onClickTd = useCallback(() => {
    if (cellData) return;
    console.log(rowIndex, cellIndex);
    dispatch({ type: CLICK_CELL, row: rowIndex, cell: cellIndex });
  }, [cellData]);
  return <td onClick={onClickTd}>{cellData}</td>;
});
```

위 코드의 경우 rowIndex, cellIndex, cellData, dispatch를 props로 받아 props의 변경이 감지되었을 경우 컴포넌트를 렌더링하고, props의 변화가 없을 경우 렌더링을 스킵하고 마지막에 렌더링된 결과를 사용한다.<br>
기본적으로 props로 들어온 object는 얕은 비교로 비교한다. 즉, props의 object와 같은 경우 "참조값"이 같은지만 비교한다는 것이다.

* useMemo : memoize된 값을 return하는 hook으로, 값뿐만 아니라 컴포넌트 자체를 return할 수도 있다.

```
useMemo(
            () => (
              // React.memo를 적용했는데도 자꾸 리렌더링이 발생하는 경우 최후의 수단
              // 컴포넌트 자체를 기억
              <Td
                key={i}
                rowIndex={rowIndex}
                cellIndex={i}
                cellData={rowData[i]}
                dispatch={dispatch}
              />
            ),
            [rowData[i]]
          )
```




