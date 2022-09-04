import React, { Component } from "react";
import Ball from "./Ball";

function getWinNumbers() {
  console.log("getWinNumbers");
  const candidate = Array(45)
    .fill()
    .map((v, i) => i + 1);
  const shuffle = [];
  while (candidate.length > 0) {
    shuffle.push(
      candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]
    );
  }
  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
  return [...winNumbers, bonusNumber];
}

class Lotto extends Component {
  state = {
    winNumbers: getWinNumbers(),
    winBalls: [],
    bonus: null,
    redo: false,
  };

  timeouts = [];

  runTimeouts = () => {
    console.log('runTimeouts')
    const { winNumbers } = this.state;
    for (let i = 0; i < winNumbers.length - 1; i++) {
      this.timeouts[i] = setTimeout(() => {
        this.setState((prevState) => {
          return {
            winBalls: [...prevState.winBalls, winNumbers[i]],
          };
        });
      }, (i + 1) * 1000);
    }
    this.timeouts[6] = setTimeout(() => {
      this.setState({
        bonus: winNumbers[6],
        redo: true,
      });
    }, 7000);
  };

  componentDidMount() {
    console.log('DidMount')
    this.runTimeouts();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('DidUpdate')
    if (!this.state.winBalls.length) {
      this.runTimeouts();
    }
  }

  componentWillUnmount() {
    this.timeouts.forEach((v) => {
      clearTimeout(v);
    });
  }

  onClickRedo = () => {
    console.log('onClickRedo');
    this.setState({
      winNumbers: getWinNumbers(), // 당첨 숫자들
      winBalls: [],
      bonus: null, // 보너스 공
      redo: false,
    });
    this.timeouts = [];
  };

  render() {
    const { winBalls, bonus, redo } = this.state;
    return (
      <>
        <div>당첨 숫자</div>
        <div id="결과창">
          {/* 반복문을 기점으로 component를 분리 / props로 값 전달 */}
          {winBalls.map((v) => (
            <Ball key={v} number={v} />
          ))}
        </div>
        <div>보너스</div>
        {bonus && <Ball number={bonus} />}
        {redo && <button onClick={this.onClickRedo}>한 번 더!</button>}
      </>
    );
  }
}

export default Lotto;

// import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
// import Ball from "./Ball";

// function getWinNumbers() {
//   console.log("getWinNumbers");
//   const candidate = Array(45)
//     .fill()
//     .map((v, i) => i + 1);
//   const shuffle = [];
//   while (candidate.length > 0) {
//     shuffle.push(
//       candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]
//     );
//   }
//   const bonusNumber = shuffle[shuffle.length - 1];
//   const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
//   return [...winNumbers, bonusNumber];
// }

// const Lotto = () => {
//   // useMemo: getWinNumbers()의 return값을 기억함
//   // 두번째 인자에 winballs를 넣으면 useMemo 값이 계속 바뀜
//   const lottoNumbers = useMemo(() => getWinNumbers(), []);
//   const [winNumbers, setWinNumbers] = useState(lottoNumbers);
//   const [winBalls, setWinBalls] = useState([]);
//   const [bonus, setBonus] = useState(null);
//   const [redo, setRedo] = useState(false);
//   const timeouts = useRef([]);

//   useEffect(() => {
//     console.log('useEffect');
//     for (let i = 0; i < winNumbers.length - 1; i++) {
//       timeouts.current[i] = setTimeout(() => {
//         setWinBalls((prevWinBalls) => {
//           return [...prevWinBalls, winNumbers[i]];
//         });
//       }, (i + 1) * 1000);
//     }
//     timeouts.current[6] = setTimeout(() => {
//       setBonus(winNumbers[6]);
//       setRedo(true);
//     }, 7000);
//     return () => {
//       timeouts.current.forEach((v) => {
//         clearTimeout(v);
//       })
//     }
//   }, [timeouts.current]); // 빈 배열이면 componentDidMount와 동일
//   // 배열에 요소(조건)가 있으면(맞으면) componentDidMount와 componentDidUpdate 둘다 수행

//   // // componentDidUpdate에서만 실행되도록 하려면?
//   // const mounted = useRef(false);
//   // useEffect(() => {
//   //   if (!mounted.current) {
//   //     mounted.current = true;
//   //   } else {
//   //     // ajax 요청
//   //   }
//   // })

//   // useCallback: onClickRedo 함수 자체를 기억함
//   const onClickRedo = useCallback(() => {
//     console.log("onClickRedo");
//     // 특징: 새로운 state가 반영이 안됨...인데 왜 반영이 되지? 어쨌든 두번째 인자에 state가 바뀌는 요소를 넣는다.
//     console.log(winNumbers);
//     setWinNumbers(getWinNumbers());
//     setWinBalls([]);
//     setBonus(null);
//     setRedo(false);
//     timeouts.current = [];
//   }, [winNumbers]);

//   return (
//     <>
//       <div>당첨 숫자</div>
//       <div id="결과창">
//         {/* 반복문을 기점으로 component를 분리 / props로 값 전달 */}
//         {winBalls.map((v) => (
//           <Ball key={v} number={v} />
//         ))}
//       </div>
//       <div>보너스</div>
//       {bonus && <Ball number={bonus} />}
//       {/* 자식 component에 props로 함수를 넘길때는 useCallback을 해야지 자식이 계속 리렌더링이 되는 현상을 방지할 수 있음 */}
//       {redo && <button onClick={onClickRedo}>한 번 더!</button>}
//     </>
//   );
// };

// export default Lotto;
