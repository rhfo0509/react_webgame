### useContext

- 참고할 만한 링크

https://velog.io/@iamhayoung/React-Hooks-useContext%EC%97%90-%EB%8C%80%ED%95%B4-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0

- 사용 목적

MineSearch -> Table -> Td -> Tr 이렇게 컴포넌트간에 계층 관계가 형성될 때, MineSearch 컴포넌트로부터 Tr 컴포넌트로 바로 props를 전달해야 할 상황이 생긴다면?<br>
기존의 방식으로는 MineSearch에서 Table로, Table에서 Td로, Td에서 Tr로, 이렇게 순차적으로 props를 넘겨줘야 했다.<br>
이러한 단점을 극복하기 위해 고안된 <b>context</b>는, 일일이 props를 넘겨주지 않고도 컴포넌트 트리 전체에서 데이터를 사용할 수 있도록 해준다.


