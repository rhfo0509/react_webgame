import React, { PureComponent } from "react";

// state을 안쓰는 경우 함수 컴포넌트로 쓰는 것이 적절
// const Ball = memo((number) => { return ... })
class Ball extends PureComponent {
  render() {
    let background;
    const { number } = this.props;
    if (number <= 10) {
      background = "#fa0009";
    } else if (number <= 20) {
      background = "#f06800";
    } else if (number <= 30) {
      background = "#eeae00";
    } else if (number <= 40) {
      background = "#e9ec49";
    } else {
      background = "#caff91";
    }
    return (
      <div className="ball" style={{ background }}>
        {number}
      </div>
    );
  }
}

export default Ball;
