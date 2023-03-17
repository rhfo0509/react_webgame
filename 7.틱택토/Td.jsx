import React, { useCallback, memo } from "react";
import { CLICK_CELL } from "./TicTacToe";

// React.memo를 사용하여 cellData가 바뀌지 않은 Td 컴포넌트의 리렌더링 방지
// React.memo는 오직 props의 변화만 감지한다.
// 반복문이 있는 컴포넌트를 memoization하는 것이 좋다.
const Td = memo(({ rowIndex, cellIndex, cellData, dispatch }) => {
  console.log("td rendered");
  
  const onClickTd = useCallback(() => {
    if (cellData) return;
    console.log(rowIndex, cellIndex);
    dispatch({ type: CLICK_CELL, row: rowIndex, cell: cellIndex });
    // dispatch({ type: CHANGE_TURN })
    // 비동기 문제!!! CLICK_CELL를 함과 동시에 CHANGE_TURN도 같이 일어나기
    // 때문에 turn이 상대 턴으로 넘어가게 됨, 조건 체크 시 문제 발생
    // 따라서 CHANGE_TURN을 조건이 만족하지 않을 때 실행하는 것으로 변경
  }, [cellData]);
  return <td onClick={onClickTd}>{cellData}</td>;
});

Td.displayName = 'Td'

export default Td;
