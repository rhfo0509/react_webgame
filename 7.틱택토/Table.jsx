import React, { memo } from "react";
import Tr from "./Tr";

// Table 컴포넌트에서 memo를 적용하는 것은 효과 X
// props의 tableData가 변하는 것은 필연적이기 때문이다.
const Table = memo(({ tableData, dispatch }) => {
  console.log("table rendered");
  return (
    <table>
      <tbody>
        {Array(tableData.length)
          .fill()
          .map((tr, i) => (
            <Tr
              key={i}
              rowData={tableData[i]}
              rowIndex={i}
              dispatch={dispatch}
            />
          ))}
      </tbody>
    </table>
  );
});

export default Table;
