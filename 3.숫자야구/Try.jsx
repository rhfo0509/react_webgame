import React, { memo } from "react";

const Try = memo(({ tryInfo }) => {
  // 부모에게서 받은 props는 자식이 바꾸면 안된다.
  // 불가피하게 자식 컴포넌트에서 바꿔야 하는 경우, props를 state로 받아서 바꿔야 한다.
  // const [result, setResult] = useState(tryInfo.result);
  return (
    <li>
      <div>{tryInfo.try}</div>
      <div>{tryInfo.result}</div>
    </li>
  );
});

Try.displayName = 'Try';

export default Try;
