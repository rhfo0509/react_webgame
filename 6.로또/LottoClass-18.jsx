import React, { Component } from "react";
import Ball from "./Ball";

function getWinNumbers() {
  const candidate = Array(45)
    .fill()
    .map((v, i) => i + 1);
  const shuffle = [];
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * candidate.length);
    const selected = candidate.splice(randomIndex, 1)[0];
    shuffle.push(selected);
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
    console.log("runTimeouts");
    const { winNumbers } = this.state;
    for (let i = 0; i < winNumbers.length - 1; i++) {
      this.timeouts[i] = setTimeout(() => {
        this.setState((prevState) => ({
          winBalls: [...prevState.winBalls, winNumbers[i]],
        }));
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
    console.log("componentDidMount");
    this.runTimeouts();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate");
    if (!this.state.winBalls.length) {
      this.runTimeouts();
    }
    if (prevState.winNumbers !== this.state.winNumbers) {
      console.log("로또 숫자를 생성합니다.");
    }
  }

  componentWillUnmount() {
    // 항상 의도치 않은 컴포넌트 언마운트에 대해
    // setTimeout이 실행되지 않도록 해아 한다. (메모리 누수 방지)
    this.timeouts.forEach((v) => clearTimeout(v));
  }

  onClickRedo = () => {
    console.log("onClickRedo");
    this.setState({
      winNumbers: getWinNumbers(),
      winBalls: [],
      bonus: null,
      redo: false,
    });
    this.timeouts = [];
  };

  render() {
    const { winBalls, bonus, redo } = this.state;
    return (
      <>
        <div>당첨 숫자</div>
        <div id="result">
          {winBalls.map((v) => (
            <Ball key={v} number={v} />
          ))}
        </div>
        <div>보너스!</div>
        {bonus && <Ball number={bonus} />}
        {redo && <button onClick={this.onClickRedo}>다시!</button>}
      </>
    );
  }
}

export default Lotto;
