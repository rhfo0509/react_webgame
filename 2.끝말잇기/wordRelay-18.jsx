const React = require("react");
const { useState, useRef } = React;

const WordRelay = () => {
  const [word, setWord] = useState("흑곰");
  // const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const inputEl = useRef(null);

  // uncontrolled input
  // ex) onSubmitForm 안에서만 사용되는 value의 경우
  const onSubmitForm = (e) => {
    e.preventDefault();
    if (word.at(-1) === e.target.children.wordInput.value.at(0)) {
      setResult("딩동댕");
      setWord(e.target.children.wordInput.value);
      e.target.children.wordInput.value = "";
    } else {
      setResult("땡");
      e.target.children.wordInput.value = "";
    }
    inputEl.current.focus();
  };

  // const onChangeInput = (e) => {
  //   setValue(e.target.value);
  // };

  return (
    <>
      <div>{word}</div>
      <form onSubmit={onSubmitForm}>
        <label htmlFor="wordInput">글자를 입력하세요: </label>
        <input
          id="wordInput"
          className="wordInput"
          ref={inputEl}
          // onChange={onChangeInput}
          // value={value}
        />
        <button>입력!</button>
      </form>
      <div>{result}</div>
    </>
  );
};

module.exports = WordRelay;
