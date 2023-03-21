import React, { PureComponent } from "react";

class Try extends PureComponent {
  // 부모에게서 받은 props는 자식이 바꾸면 안된다.
  // 불가피하게 자식 컴포넌트에서 바꿔야 하는 경우, props를 state로 받아서 바꿔야 한다.
  // state = { result: this.props.tryInfo.result } ---> this.setState를 통해 부모로부터 받은 result 값을 바꾼다.
  render() {
    const { tryInfo } = this.props;
    return (
      <li>
        <div>{tryInfo.try}</div>
        <div>{tryInfo.result}</div>
      </li>
    );
  }
}

export default Try;
