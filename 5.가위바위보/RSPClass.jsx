import React, { Component } from "react";

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

class RSP extends Component {
  state = {
    result: "",
    score: 0,
    imgCoord: rspCoords.바위,
  };

  interval;

  componentDidMount() {
    // 컴포넌트가 첫 렌더링된 후, 여기에 비동기 요청을 많이 해요.
    const { imgCoord } = this.state;
    console.log(imgCoord);
    // imgCoord를 changeHand 바깥에 선언 시...
    // 클로저는 함수와 외부 변수와의 관계입니다.
    // setTimeout 안에 있는 함수랑 바깥의 imgCoords가 클로저를 생성해서 값이 고정되어버립니다.
    // imgCoords는 구조분해 할당으로 인해서 참조가 아닌 값이 되는 것도 맞고요.
    this.interval = setInterval(this.changeHand, 100);
  }

  componentDidUpdate() {
    // 리렌더링 후
  }

  componentWillUnmount() {
    // 컴포넌트가 제거하기 직전, 비동기 요청 정리를 많이 해요.
    clearInterval(this.interval);
  }

  changeHand = () => {
    const { imgCoord } = this.state;
    if (imgCoord === rspCoords.바위) {
      this.setState({
        imgCoord: rspCoords.가위,
      });
    } else if (imgCoord === rspCoords.가위) {
      this.setState({
        imgCoord: rspCoords.보,
      });
    } else {
      this.setState({
        imgCoord: rspCoords.바위,
      });
    }
  };

  onClickBtn = (choice) => (e) => {
    clearInterval(this.interval);
    const { imgCoord } = this.state;
    const cpuScore = scores[computerChoice(imgCoord)];
    const myScore = scores[choice];
    const diff = myScore - cpuScore;

    if ([1, -2].includes(diff)) {
      this.setState((prevState) => ({
        result: '이겼습니다.',
        score: ++prevState.score,
      }));
    } else if (diff === 0) {
      this.setState({
        result: "비겼습니다.",
      });
    } else {
      this.setState((prevState) => ({
        result: '졌습니다.',
        score: --prevState.score,
      }));
    }

    // 결과 보여주고 2초 후 다시 실행
    // 이 때 동안은 클릭이 되지 않게 한다.

    const target = document.getElementsByClassName('btn');
    [...target].forEach(e => {
      e.disabled = !e.disabled
    });

    setTimeout(() => {
      this.interval = setInterval(this.changeHand, 100);
      [...target].forEach(e => {
        e.disabled = !e.disabled
      });
    }, 2000);
  };

  render() {
    const { result, score, imgCoord } = this.state;
    return (
      <>
        <div
          id="computer"
          style={{
            background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0`,
          }}
        />
        <div>
          <button id="rock" className="btn" onClick={this.onClickBtn("바위")}>
            바위
          </button>
          <button
            id="scissor"
            className="btn"
            onClick={this.onClickBtn("가위")}
          >
            가위
          </button>
          <button id="paper" className="btn" onClick={this.onClickBtn("보")}>
            보
          </button>
        </div>
        <div>{result}</div>
        <div>현재 {score}점</div>
      </>
    );
  }
}

export default RSP;
