import React, { useState, useRef } from "react";

let timerId, startTime, endTime;

const ResponseCheck = () => {
  const [state, setState] = useState("waiting");
  const [message, setMessage] = useState("클릭해서 시작하세요.");
  const [result, setResult] = useState([]);

  // 값이 변해도 렌더링할 필요가 없는 timerId, startTime, endTime
  // useRef 사용
  const timerId = useRef(null);
  const startTime = useRef();
  const endTime = useRef();

  const onClickScreen = () => {
    if (state === "waiting") {
      setState("ready");
      setMessage("초록색이 되면 클릭하세요");
      timerId.current = setTimeout(() => {
        setState("now");
        setMessage("지금 클릭");
        startTime.current = new Date();
      }, Math.floor(Math.random() * 1000) + 2000);
    } else if (state === "ready") {
      setState("waiting");
      setMessage("너무 성급하시군요!");
      clearTimeout(timerId.current);
    } else if (state === "now") {
      endTime.current = new Date();
      setState("waiting");
      setMessage("초록색이 되면 클릭하세요");
      setResult((prevResult) => {
        return [...prevResult, endTime.current - startTime.current];
      });
    }
  };

  const onReset = () => {
    setResult([]);
  };

  const renderAverage = (result) => {
    return result.length ? (
      <>
        <div>
          평균 시간: {result.reduce((p, c) => p + c, 0) / result.length}ms
        </div>
        <button onClick={onReset}>리셋</button>
      </>
    ) : null;
  };

  return (
    <>
      <div id="screen" className={state} onClick={onClickScreen}>
        {message}
      </div>
      {renderAverage(result)}
    </>
  );
};

export default ResponseCheck;
