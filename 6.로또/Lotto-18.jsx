import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Ball from "./Ball";

function getWinNumbers() {
  console.log('getWinNumbers');
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
  console.log([...winNumbers, bonusNumber]);
  return [...winNumbers, bonusNumber];
}

// hooks는 " 순서 " 가 중요!! (조건문 안에 넣지 x, 함수나 반복문 안에도 웬만하면 넣지 않기)
const Lotto = () => {
  // useMemo: 두번째 인자 배열의 요소가 바뀌지 않는 한 렌더링되지 않음
  // useMemo: 복잡한 함수 결과값을 기억, useRef: 일반 값을 기억

  const lottoNumbers = useMemo(() => getWinNumbers(), []);
  const [winNumbers, setWinNumbers] = useState(lottoNumbers);
  // const [winNumbers, setWinNumbers] = useState(getWinNumbers());
  const [winBalls, setWinBalls] = useState([]);
  const [bonus, setBonus] = useState(null);
  const [redo, setRedo] = useState(false);
  const timeouts = useRef([]);

  // input이 빈 배열이면 componentDidMount와 동일.
  // 배열에 요소가 있으면 componentDidMount와 componentDidUpdate 둘 다 수행
  // return 부분: componentWillUnmount 자리
  useEffect(() => {
    console.log('useEffect');
    for (let i = 0; i < winNumbers.length - 1; i++) {
      timeouts.current[i] = setTimeout(() => {
        setWinBalls((prevWinBalls) => [...prevWinBalls, winNumbers[i]])
      }, (i + 1) * 1000);
    }
    timeouts.current[6] = setTimeout(() => {
      setBonus(winNumbers[6]);
      setRedo(true);
    }, 7000);

    return () => {
      console.log('clearTimeout')
      timeouts.current.forEach((v) => clearTimeout(v));
    }
  }, [timeouts.current]);

  useEffect(() => {
    console.log('로또 숫자를 생성합니다.')
  }, [winNumbers])

  // useCallback: 함수 자체를 기억, useCallback이 없다면 매번 새로운 함수 생성
  // 자식 컴포넌트에 함수를 넘길 경우 useCallback 사용 필수! -> 부모가 매번 새로운 함수(props)를 전달한다고 생각하기 때문이다. (쓸데없이 리렌더링되는 문제)
  const onClickRedo = useCallback(() => {
    console.log('onClickRedo')
    console.log(winNumbers);  // 기억을 너무 잘해서 최초의 winNumbers만 반영됨, useCallback의 두 번째 배열에 state 값을 넣어주면 정상 반영됨
    setWinNumbers(getWinNumbers());
    setWinBalls([]);
    setBonus(null);
    setRedo(null);
    timeouts.current = [];
  }, [winNumbers]);

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
      {redo && <button onClick={onClickRedo}>다시!</button>}
    </>
  );
}

export default Lotto;