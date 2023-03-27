import React, { useContext, memo } from "react";
import { TableContext } from "./MineSearch";
import Tr from "./Tr";

// timer 때문에 쓸데없이 계속 렌더링되는 것을 방지하기 위해 memo로 감싸준다.
const Table = memo(() => {
  const { tableData } = useContext(TableContext);
  return (
    <table>
      <tbody>
        {Array(tableData.length)
          .fill()
          .map((tr, i) => (
            <Tr key={i} rowIndex={i} />
          ))}
      </tbody>
    </table>
  );
});

export default Table;
