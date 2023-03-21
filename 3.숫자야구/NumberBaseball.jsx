import React, { useRef, useState } from "react";
import Try from "./Try";

function getNumbers() {
  // 숫자 4개를 겹치지 않고 랜덤하게 뽑느 함수
  const candidate = [...Array(10)].map((_, i) => i);
  const array = [];
  for (let i = 0; i < 4; i++) {
    // randomIndex는 0부터 9까지의 값
    let randomIndex;
    if (i === 0) {
      randomIndex = Math.floor(Math.random() * 9) + 1;
    } else {
      randomIndex = Math.floor(Math.random() * candidate.length);
    }

    array.push(candidate.splice(randomIndex, 1)[0]);
  }

  return array;
}

const NumberBaseball = () => {
  const [result, setResult] = useState("");
  const [value, setValue] = useState("");
  // setAnswer에 함수를 넣으면 그 함수의 return값이 저장됨
  // 리렌더링될 때마다 함수가 쓸데없이 호출되는 것 방지(lazy init)
  const [answer, setAnswer] = useState(getNumbers);
  const [tries, setTries] = useState([]);
  const inputRef = useRef(null);

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (value === answer.join("")) {
      setResult("홈런!");
      setTries((prevTries) => [...prevTries, { try: value, result: result }]);
      alert("게임을 다시 시작합니다.");
      setValue("");
      // 이 자리는 return 값을 넣어줘야 함 (되기는 한다.)
      setAnswer(getNumbers());
      setTries([]);
    } else {
      if (tries.length >= 9) {
        setResult(`10번 넘게 틀려서 실패! 답은 ${answer.join("")}였습니다!`);
        alert("게임을 다시 시작합니다.");
        setValue("");
        // 이 자리는 return 값을 넣어줘야 함 (되기는 한다.)
        setAnswer(getNumbers());
        setTries([]);
      }

      const answerArray = value.split("").map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;
      console.log(answer.join(""));
      for (let i = 0; i < 4; i++) {
        if (answerArray[i] === answer[i]) {
          strike += 1;
        } else if (answer.includes(answerArray[i])) {
          ball += 1;
        }
      }
      setTries((prevTries) => [
        ...prevTries,
        { try: value, result: `${strike} 스트라이크, ${ball} 볼입니다.` },
      ]);
      setValue("");
    }
    inputRef.current.focus();
  };

  const onChangeInput = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <h1>{result}</h1>
      <form onSubmit={onSubmitForm}>
        {/* value와 onChange는 항상 함께 사용해야 함 (또는 defaultValue) */}
        <input
          maxLength={4}
          value={value}
          onChange={onChangeInput}
          ref={inputRef}
        />
        <button>입력!</button>
      </form>
      <div>시도: {tries.length}</div>
      <ul>
        {tries.map((v, i) => {
          return <Try key={`${i + 1}차 시도`} tryInfo={v} index={i} />;
        })}
      </ul>
    </>
  );
};

export default NumberBaseball;
