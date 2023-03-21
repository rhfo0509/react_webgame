import React, { Component } from "react";

class ResponseCheck extends Component {
  state = {
    state: "waiting",
    message: "클릭해서 시작하세요.",
    result: [],
  };

  // 렌더링이 다시 일어나지 않아야 하는 경우
  timerId;
  startTime;
  endTime;

  onClickScreen = (e) => {
    const { state, message, result } = this.state;

    if (state === "waiting") {
      this.setState({
        state: "ready",
        message: "초록색이 되면 클릭하세요",
      });
      this.timerId = setTimeout(() => {
        this.setState({
          state: "now",
          message: "지금 클릭",
        });
        this.startTime = new Date();
      }, Math.floor(Math.random() * 1000) + 2000);
    } else if (state === "ready") {
      this.setState({
        state: "waiting",
        message: "너무 성급하시군요!",
      });
      clearTimeout(this.timerId);
    } else if (state === "now") {
      this.endTime = new Date();
      this.setState((prevState) => ({
        state: "waiting",
        message: "초록색이 되면 클릭하세요",
        result: [...prevState.result, this.endTime - this.startTime],
      }));
    }
  };

  onReset = () => {
    this.setState({
      result: [],
    });
  };
  renderAverage = (result) => {
    return result.length ? (
      <>
        <div>
          평균 시간: {result.reduce((p, c) => p + c, 0) / result.length}ms
        </div>
        <button onClick={this.onReset}>리셋</button>
      </>
    ) : null;
  };

  render() {
    const { state, message, result } = this.state;
    return (
      <>
        <div id="screen" className={state} onClick={this.onClickScreen}>
          {message}
        </div>
        {this.renderAverage(result)}
      </>
    );
  }
}

export default ResponseCheck;
