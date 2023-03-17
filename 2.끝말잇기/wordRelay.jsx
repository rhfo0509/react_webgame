const React = require('react');
// const { Component } = React;
const { useState, useRef } = React;

// class WordRelay extends Component {
//   state = {
//     word: '백곰',
//     value: '',
//     result: '',
//   };

//   onSubmitForm = (e) => {
//     e.preventDefault();
//     if (this.state.word[this.state.word.length - 1] === this.state.value[0]) {
//       this.setState({
//         result: '딩동댕',
//         word: this.state.value,
//         value: '',
//       });
//       this.input.focus();
//     } else {
//       this.setState({
//         result: '땡',
//         value: '',
//       });
//       this.input.focus();
//     }
//   }

//   onChangeInput = (e) => {
//     this.setState({ value: e.currentTarget.value });
//   }

//   input;

//   onRefInput = (c) => {
//     this.input = c;
//   }

//   render() {
//     return (
//       <>
//         <div>{this.state.word}</div>
//         <form onSubmit={this.onSubmitForm}>
//           <input ref={this.onRefInput} value={this.state.value} onChange={this.onChangeInput} />
//           <button>입력!</button>
//         </form>
//         <div>{this.state.result}</div>
//       </>
//     )
//   };
// }

const WordRelay = () => {
  const [word, setWord] = useState('백곰');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const inputRef = useRef(null);

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (word[word.length - 1] === value[0]) {
      setResult('딩동댕');
      setWord(value);
      setValue('');
      inputRef.current.focus();
    } else {
      setResult('땡');
      setValue('');
      inputRef.current.focus();
    }
  }

  const onChangeInput = (e) => {
    setValue(e.currentTarget.value);
  }

    return (
      <>
        <div>{word}</div>
        <form onSubmit={onSubmitForm}>
          <label htmlFor="wordInput">글자를 입력하세요: </label>
          <input id="wordInput" className="wordInput" ref={inputRef} value={value} onChange={onChangeInput} />
          <button>입력!</button>
        </form>
        <div>{result}</div>
      </>
    )
}

module.exports = WordRelay;