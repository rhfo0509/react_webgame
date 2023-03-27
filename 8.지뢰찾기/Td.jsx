import React, { useCallback, useContext, useMemo, memo } from "react";
import {
  CODE,
  CLICK_MINE,
  FLAG_CELL,
  NORMALIZE_CELL,
  OPEN_CELL,
  QUESTION_CELL,
  TableContext,
} from "./MineSearch";

// Table 컴포넌트에 memo를 적용하였으면 하위 컴포넌트인 Tr, Td 컴포넌트에도 memo를 적용시켜야 한다.
const Td = memo(({ rowIndex, cellIndex }) => {
  const { tableData, halted, dispatch } = useContext(TableContext);
  const getTdStyle = (code) => {
    console.log('getTdStyle');
    switch (code) {
      case CODE.NORMAL:
      case CODE.MINE:
        return {
          background: "#444",
        };
      case CODE.OPENED:
      case CODE.CLICKED_MINE:
        return {
          background: "white",
        };
      case CODE.QUESTION:
      case CODE.QUESTION_MINE:
        return {
          background: "yellow",
        };
      case CODE.FLAG:
      case CODE.FLAG_MINE:
        return {
          background: "red",
        };
      default:
        return {
          background: "#fff",
        };
    }
  };
  const getTdText = (code) => {
    switch (code) {
      case CODE.NORMAL:
        return "";
      case CODE.MINE:
        return "x";
      case CODE.QUESTION:
      case CODE.QUESTION_MINE:
        return "?";
      case CODE.FLAG:
      case CODE.FLAG_MINE:
        return "!";
      case CODE.CLICKED_MINE:
        return "펑";
      default:
        return code || "";
    }
  };
  const onClickTd = useCallback(() => {
    if (halted) return;
    console.log("onClickTd");
    switch (tableData[rowIndex][cellIndex]) {
      case CODE.OPENED:
      case CODE.FLAG_MINE:
      case CODE.FLAG:
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        return;
      case CODE.NORMAL:
        dispatch({ type: OPEN_CELL, row: rowIndex, cell: cellIndex });
        return;
      case CODE.MINE:
        dispatch({ type: CLICK_MINE, row: rowIndex, cell: cellIndex });
      default:
        return;
    }
  }, [tableData[rowIndex][cellIndex], halted]);
  // 함수 안에서 사용하는 상태나 props는 꼭 deps 배열 내에 포함

  const onRightClickTd = useCallback(
    (e) => {
      e.preventDefault();

      if (halted) return;
      console.log("onRightClickTd");
      switch (tableData[rowIndex][cellIndex]) {
        case CODE.NORMAL:
        case CODE.MINE: {
          dispatch({ type: FLAG_CELL, row: rowIndex, cell: cellIndex });
          return;
        }
        case CODE.FLAG:
        case CODE.FLAG_MINE: {
          dispatch({
            type: QUESTION_CELL,
            row: rowIndex,
            cell: cellIndex,
          });
          return;
        }
        case CODE.QUESTION:
        case CODE.QUESTION_MINE: {
          dispatch({
            type: NORMALIZE_CELL,
            row: rowIndex,
            cell: cellIndex,
          });
          return;
        }
        default:
          return;
      }
    },
    [tableData[rowIndex][cellIndex], halted]
  ); // 함수 안에서 사용하는 상태나 props는 꼭 deps 배열 내에 포함

    console.log('td rendered');

  return useMemo(() =>(
    <td
      style={getTdStyle(tableData[rowIndex][cellIndex])}
      onClick={onClickTd}
      onContextMenu={onRightClickTd}
    >
      {getTdText(tableData[rowIndex][cellIndex])}
    </td>
  ), [tableData[rowIndex][cellIndex]]);
});

export default Td;
