import React, { PureComponent, createRef } from "react";
import Try from "./TryClass";

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

class NumberBaseball extends PureComponent {
  state = {
    result: "",
    value: "",
    answer: getNumbers(),
    tries: [],
  };

  onSubmitForm = (e) => {
    const { value, answer, tries } = this.state;
    e.preventDefault();
    if (value === answer.join("")) {
      this.setState((prevState) => ({
        result: "홈런!",
        tries: [...prevState.tries, { try: value, result: "홈런!" }],
      }));
      alert("게임을 다시 시작합니다.");
      this.setState({
        value: "",
        answer: getNumbers(),
        tries: [],
      });
    } else {
      if (tries.length >= 9) {
        this.setState({
          result: `10번 넘게 틀려서 실패! 답은 ${answer.join("")}였습니다!`,
        });
        alert("게임을 다시 시작합니다.");
        this.setState({
          value: "",
          answer: getNumbers(),
          tries: [],
        });
      }

      const answerArray = value.split("").map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;
      console.log(answer);
      for (let i = 0; i < 4; i++) {
        if (answerArray[i] === answer[i]) {
          strike += 1;
        } else if (answer.includes(answerArray[i])) {
          ball += 1;
        }
      }
      this.setState((prevState) => ({
        tries: [
          ...prevState.tries,
          { try: value, result: `${strike} 스트라이크, ${ball} 볼입니다.` },
        ],
        value: "",
      }));
    }
    this.inputRef.current.focus();
  };

  onChangeInput = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  inputRef = createRef();

  render() {
    const { result, value, tries } = this.state;
    return (
      <>
        <h1>{result}</h1>
        <form onSubmit={this.onSubmitForm}>
          {/* value와 onChange는 항상 함께 사용해야 함 (또는 defaultValue) */}
          <input
            maxLength={4}
            value={value}
            onChange={this.onChangeInput}
            ref={this.inputRef}
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
  }
}

export default NumberBaseball;
