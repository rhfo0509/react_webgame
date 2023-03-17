import React, { useReducer, createContext, useMemo } from "react";
import Form from "./Form";
import Table from "./Table";

export const CODE = {
  MINE: -7,
  NORMAL: -1,
  QUESTION: -2,
  FLAG: -3,
  QUESTION_MINE: -4,
  FLAG_MINE: -5,
  CLICKED_MINE: -6,
  OPENED: 0, // 0 이상이면 opened
};

// context 객체 생성
// createContext 함수 호출 시 Provider와 Consumer 컴포넌트 반환
// initialValue는 Provider를 사용하지 않았을 때 적용될 초기값
export const TableContext = createContext({
  tableData: [],
  halted: true,
  dispatch: () => {},
});

const initialState = {
  data: {
    row: 0,
    cell: 0,
    mine: 0,
  },
  tableData: [],
  timer: 0,
  result: "",
  halted: true,
  openCount: 0,
};

export const START_GAME = "START_GAME";
export const OPEN_CELL = "OPEN_CELL";
export const CLICK_MINE = "CLICK_MINE";
export const FLAG_CELL = "FLAG_CELL";
export const QUESTION_CELL = "QUESTION_CELL";
export const NORMALIZE_CELL = "NORMALIZE_CELL";

const plantMine = (row, cell, mine) => {
  console.log(row, cell, mine);

  const table = [];
  for (let i = 0; i < row; i++) {
    const rowData = [];
    table.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }

  const candidate = Array(row * cell)
    .fill(0)
    .map((_, i) => i);

  for (let i = 0; i < mine; i++) {
    const mineIndex = Math.floor(Math.random() * candidate.length);
    const selected = candidate.splice(mineIndex, 1)[0];
    const mineRow = Math.floor(selected / cell);
    const mineCell = selected % cell;
    console.log(mineRow, mineCell);
    table[mineRow][mineCell] = CODE.MINE;
  }

  console.log(table);
  return table;
};

const reducer = (state, action) => {
  switch (action.type) {
    case START_GAME: {
      console.log(START_GAME);
      const data = { ...state.data };
      data.row = action.row;
      data.cell = action.cell;
      data.mine = action.mine;
      return {
        ...state,
        data,
        tableData: plantMine(action.row, action.cell, action.mine),
        halted: false,
        openCount: 0,
      };
    }
    case OPEN_CELL: {
      const tableData = [...state.tableData];
      // 어떤 칸이 열릴지 모르기 때문에 모든 칸을 새로 만들어줌.
      tableData.forEach((row, i) => {
        tableData[i] = [...tableData[i]];
      });
      // tableData[action.row] = [...tableData[action.row]];

      const checked = [];
      let openCount = 0;
      const checkAround = (row, cell) => {
        // 칸이 아닌 곳이 검사 대상이 되었을 경우 필터링
        if (
          row < 0 ||
          row >= tableData.length ||
          cell < 0 ||
          cell >= tableData[0].length
        ) {
          return;
        }

        // 이미 검사된 곳은 다시 검사하지 않도록 (maximum call stack size exceeded 방지)
        if (checked.includes(row + "/" + cell)) {
          return;
        } else {
          checked.push(row + "/" + cell);
        }

        let around = [];
        // 이렇게 하는 대신 optional chaining을 써도 좋음.
        if (tableData[row - 1]) {
          around = around.concat([
            tableData[row - 1][cell - 1],
            tableData[row - 1][cell],
            tableData[row - 1][cell + 1],
          ]);
        }
        around = around.concat([
          tableData[row][cell - 1],
          tableData[row][cell + 1],
        ]);
        if (tableData[row + 1]) {
          around = around.concat([
            tableData[row + 1][cell - 1],
            tableData[row + 1][cell],
            tableData[row + 1][cell + 1],
          ]);
        }

        // [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v) 가 true인 요소들의 배열을 반환
        const mineCount = around.filter((v) =>
          [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)
        ).length;

        if (mineCount === 0) {
          let near = [];
          if (row > 0) {
            near.push([row - 1, cell - 1]);
            near.push([row - 1, cell]);
            near.push([row - 1, cell + 1]);
          }
          near.push([row, cell - 1]);
          near.push([row, cell + 1]);
          if (row < tableData.length - 1) {
            near = near.concat([
              [row + 1, cell - 1],
              [row + 1, cell],
              [row + 1, cell + 1],
            ]);
            near.push([row + 1, cell - 1]);
            near.push([row + 1, cell]);
            near.push([row + 1, cell + 1]);
          }
          near.forEach((v) => {
            // 이미 열려진 곳 배제는 checked 배열에서 검사하므로 안 써도 상관없으나
            // 다시 checkAround 함수를 실행하지 않음으로써 더욱 간결해진다.

            // tableData[v[0]][v[1]] < CODE.OPENED가 되어야 옳다.
            // CODE.OPENED는 0이지만, 주변에 지뢰가 있는 경우 CODE값이 양수가 되기 때문이다.
            // 양수인 경우도 배제해야 한다.
            if (tableData[v[0]][v[1]] < CODE.OPENED) {
              checkAround(v[0], v[1]);
            }
          });
        }
        tableData[row][cell] = mineCount;

        openCount += 1;
        console.log(
          `${row}행 ${cell}열 오픈, ${state.openCount + openCount}번째`
        );
      };
      checkAround(action.row, action.cell);
      // 승리 조건 검사
      let halted = false;
      let result = "";
      console.log(halted, result);
      console.log(state.data.row, state.data.cell, state.data.mine);
      if (
        state.data.row * state.data.cell - state.data.mine ===
        state.openCount + openCount
      ) {
        halted = true;
        result = "승리하셨습니다.";
      }

      console.log(OPEN_CELL, tableData);
      return {
        ...state,
        tableData,
        openCount: state.openCount + openCount,
        halted,
        result,
      };
    }

    case CLICK_MINE: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...tableData[action.row]];
      tableData[action.row][action.cell] = CODE.CLICKED_MINE;
      console.log(CLICK_MINE, tableData);
      return {
        ...state,
        tableData,
        halted: true,
      };
    }
    case FLAG_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.NORMAL) {
        tableData[action.row][action.cell] = CODE.FLAG;
      } else {
        tableData[action.row][action.cell] = CODE.FLAG_MINE;
      }
      console.log(FLAG_CELL, tableData);
      return {
        ...state,
        tableData,
      };
    }
    case QUESTION_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.FLAG) {
        tableData[action.row][action.cell] = CODE.QUESTION;
      } else {
        tableData[action.row][action.cell] = CODE.QUESTION_MINE;
      }
      console.log(QUESTION_CELL, tableData);
      return {
        ...state,
        tableData,
      };
    }
    case NORMALIZE_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.QUESTION) {
        tableData[action.row][action.cell] = CODE.NORMAL;
      } else {
        tableData[action.row][action.cell] = CODE.MINE;
      }
      console.log(NORMALIZE_CELL, tableData);
      return {
        ...state,
        tableData,
      };
    }

    default:
      return state;
  }
};

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, timer, result, halted } = state;

  const value = useMemo(() => ({ tableData, halted, dispatch }), [tableData]);

  return (
    // Provider: 생성한 context를 하위 컴포넌트에 전달하는 역할
    // 하위 컴포넌트는 value에 대해 자유롭게 접근이 가능함
    // 주의: MineSearch 컴포넌트가 리렌더링되면 value도 리렌더링됨=> useContext를 사용하고 있는 모든 컴포넌트도 리렌더링됨
    // useMemo로 자식 컴포넌트 리렌더링 방지
    <TableContext.Provider value={value}>
      <Form />
      <div>{timer}</div>
      <Table />
      <div>{result}</div>
    </TableContext.Provider>
  );
};

export default MineSearch;
