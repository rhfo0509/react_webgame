import React, { useContext, memo } from "react";
import { TableContext } from "./MineSearch";
import Td from "./Td";

// Table 컴포넌트에 memo를 적용하였으면 하위 컴포넌트인 Tr, Td 컴포넌트에도 memo를 적용시켜야 한다.
const Tr = memo(({ rowIndex }) => {
  const { tableData } = useContext(TableContext);
  return (
    <tr>
      {tableData[0] &&
        Array(tableData[0].length)
          .fill()
          .map((td, i) => <Td key={i} rowIndex={rowIndex} cellIndex={i} />)}
    </tr>
  );
});

export default Tr;
