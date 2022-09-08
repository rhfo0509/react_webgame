import React, { useCallback, useState, useContext } from "react";
import { TableContext } from "./MineSearch";
import { START_GAME } from "./MineSearch";

const Form = () => {
  const [row, setRow] = useState(10);
  const [cell, setCell] = useState(10);
  const [mine, setMine] = useState(10);
  const { dispatch } = useContext(TableContext);

  // useCallback : 불필요한 렌더링 방지
  const onChangeRow = useCallback((e) => {
    setRow(e.target.value);
  }, []);

  const onChangeCell = useCallback((e) => {
    setCell(e.target.value);
  }, []);

  const onChangeMine = useCallback((e) => {
    setMine(e.target.value);
  }, []);

  // row, cell, mine이 전부 입력되어야 버튼을 클릭할 수 있는가?
  const onClickBtn = useCallback(
    (e) => {
      dispatch({ type: START_GAME, row, cell, mine });
    },
    [row, cell, mine]
  );

  return (
    <div>
      <input
        type="number"
        placeholder="세로"
        value={row}
        onChange={onChangeRow}
      />
      <input
        type="number"
        placeholder="가로"
        value={cell}
        onChange={onChangeCell}
      />
      <input
        type="number"
        placeholder="지뢰"
        value={mine}
        onChange={onChangeMine}
      />
      <button onClick={onClickBtn}>생성</button>
    </div>
  );
};

export default Form;
