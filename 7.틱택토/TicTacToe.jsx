import React, { useState, useReducer, useCallback, useEffect } from "react";
import Table from "./Table";

// 자식 컴포넌트에서 사용하는 액션 타입을 위해 export를 해준다.
export const SET_WINNER = "SET_WINNER";
export const CLICK_CELL = "CLICK_CELL";
export const CHANGE_TURN = "CHANGE_TURN";
export const RESET_GAME = "RESET_GAME";

const initialState = {
  winner: "",
  turn: "O",
  tableData: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  recentCell: [-1, -1],
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_WINNER:
      console.log(SET_WINNER);
      // state.winner = action.winner (불가)
      // 불변성을 위해 객체를 (얕은)복사해 바뀌는 부분만 변경
      return {
        ...state,
        winner: action.winner,
      };
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
    case CHANGE_TURN:
      console.log(CHANGE_TURN);
      return {
        ...state,
        turn: state.turn === "O" ? "X" : "O",
      };
    case RESET_GAME:
      console.log(RESET_GAME);
      return {
        ...state,
        turn: "O",
        tableData: [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ],
        recentCell: [-1, -1],
      };
    default:
      return state;
  }
};

const TicTacToe = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [winner, setWinner] = useState('');
  // const [turn, setTurn] = useState('O');
  // const [tableData, setTableData] = useState([['','',''], ['','',''], ['','','']]);
  const { tableData, turn, winner, recentCell } = state;

  // 비동기 state에 대한 처리: useEffect
  // click event가 발생하여 tableData가 변경되었을 때 실행
  useEffect(() => {
    const [row, cell] = recentCell;
    if (row < 0) return;

    console.log("useEffect");

    let win = false;
    if (
      tableData[row][0] === turn &&
      tableData[row][1] === turn &&
      tableData[row][2] === turn
    ) {
      win = true;
    }
    if (
      tableData[0][cell] === turn &&
      tableData[1][cell] === turn &&
      tableData[2][cell] === turn
    ) {
      win = true;
    }
    if (
      tableData[0][0] === turn &&
      tableData[1][1] === turn &&
      tableData[2][2] === turn
    ) {
      win = true;
    }
    if (
      tableData[0][2] === turn &&
      tableData[1][1] === turn &&
      tableData[2][0] === turn
    ) {
      win = true;
    }
    // console.log(win, row, cell, tableData, turn)

    if (win) {
      // 승리 시
      dispatch({ type: SET_WINNER, winner: turn });
      dispatch({ type: RESET_GAME });
    } else {
      let all = true;
      tableData.forEach((row) => {
        row.forEach((cell) => {
          if (!cell) {
            all = false;
          }
        });
      });

      if (all) {
        // 무승부
        dispatch({ type: SET_WINNER, winner: '' });
        dispatch({ type: RESET_GAME });
      } else {
        // 무승부가 아니면
        dispatch({ type: CHANGE_TURN });
      }
    }
  }, [recentCell]);

  return (
    <>
      <Table tableData={tableData} dispatch={dispatch} />
      {winner && <div>{winner}님의 승리</div>}
    </>
  );
};

export default TicTacToe;
