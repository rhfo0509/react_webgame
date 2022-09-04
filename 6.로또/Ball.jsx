// 제일 마지막 자식 컴포넌트는 PureComponent를 사용한다.
import React, { memo, PureComponent } from "react";

// class Ball extends PureComponent {
//   render() {
//     let background;
//     if (number <= 10) {
//       background = "red";
//     } else if (number <= 20) {
//       background = "orange";
//     } else if (number <= 30) {
//       background = " yellow";
//     } else if (number >= 40) {
//       background = "green";
//     } else {
//       background = "blue";
//     }
//     return (
//       <div className="ball" style={{ background }}>
//         {number}
//       </div>
//     );
//   }
// }

// 함수 컴포넌트 - High Order Component
// ( PureComponent 적용하려면 memo로 감싸주기 )
const Ball = memo(({ number }) => {
  let background;
  if (number <= 10) {
    background = "red";
  } else if (number <= 20) {
    background = "orange";
  } else if (number <= 30) {
    background = " yellow";
  } else if (number >= 40) {
    background = "green";
  } else {
    background = "blue";
  }
  return (
    <div className="ball" style={{ background }}>
      {number}
    </div>
  );
});

export default Ball;
