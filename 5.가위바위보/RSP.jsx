import React, { useState, useRef, useEffect } from "react";
import useInterval from "./useInterval";

// 클래스의 경우 lifecycle
// constructor -> render -> ref -> componentDidMount
// (state/props 바뀔때) shouldComponentUpdate(true) -> render -> componentDidUpdate
const rspCoords = {
  바위: "0",
  가위: "-142px",
  보: "-284px",
};

const scores = {
  바위: "0",
  가위: "-1",
  보: "1",
};

const computerChoice = (imgCoord) => {
  return Object.entries(rspCoords).find((v) => v[1] === imgCoord)[0];
};

const RSP = () => {
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [imgCoord, setImgCoord] = useState(rspCoords.바위);
  // const interval = useRef();

  // // componentDidMount, componentDidUpdate 역할
  // useEffect(() => {
  //   interval.current = setInterval(changeHand, 100);
  //   // componentWillUnmount 역할
  //   return () => {
  //     clearInterval(interval.current);
  //   }
  // }, [imgCoord]);
  const [isRunning, setIsRunning] = useState(true);

  const changeHand = () => {
    if (imgCoord === rspCoords.바위) {
      setImgCoord(rspCoords.가위);
    } else if (imgCoord === rspCoords.가위) {
      setImgCoord(rspCoords.보);
    } else {
      setImgCoord(rspCoords.바위);
    }
  };

  useInterval(changeHand, isRunning ? 100 : null);

  const onClickBtn = (choice) => (e) => {
    if (isRunning) {
      setIsRunning(false);
      const cpuScore = scores[computerChoice(imgCoord)];
      const myScore = scores[choice];
      const diff = myScore - cpuScore;

      if ([1, -2].includes(diff)) {
        setResult("이겼습니다.");
        setScore((prevScore) => ++prevScore);
      } else if (diff === 0) {
        setResult("비겼습니다.");
      } else {
        setResult("졌습니다.");
        setScore((prevScore) => --prevScore);
      }

      // 결과 보여주고 2초 후 다시 실행
      // 이 때 동안은 클릭이 되지 않게 한다.

      // const target = document.getElementsByClassName('btn');
      // [...target].forEach(e => {
      //   e.disabled = !e.disabled
      // });

      setTimeout(() => {
        // interval.current = setInterval(changeHand, 100);
        // [...target].forEach(e => {
        //   e.disabled = !e.disabled
        // });
        setIsRunning(true);
      }, 2000);
    }
  };

  return (
    <>
      <div
        id="computer"
        style={{
          background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0`,
        }}
      />
      <div>
        <button id="rock" className="btn" onClick={onClickBtn("바위")}>
          바위
        </button>
        <button id="scissor" className="btn" onClick={onClickBtn("가위")}>
          가위
        </button>
        <button id="paper" className="btn" onClick={onClickBtn("보")}>
          보
        </button>
      </div>
      <div>{result}</div>
      <div>현재 {score}점</div>
    </>
  );
};

export default RSP;
