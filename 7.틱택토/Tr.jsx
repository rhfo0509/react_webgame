import React, { memo, useMemo } from "react";
import Td from "./Td";

// React.memo를 사용하여 rowData가 바뀌지 않은 Tr 컴포넌트의 리렌더링 방지
// React.memo는 오직 props의 변화만 감지한다.
// 반복문이 있는 컴포넌트를 memoization하는 것이 좋다.
const Tr = memo(({ rowData, rowIndex, dispatch }) => {
  console.log("tr rendered");
  return (
    <tr>
      {Array(rowData.length)
        .fill()
        .map((td, i) =>
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
        )}
    </tr>
  );
});

Tr.displayName = "Tr";

export default Tr;
