* @babel/core: 최신 문법을 옛날 문법으로 바꿔주는 기본적인 babel
* @babel/preset-env: 본인의 환경 설정에 맞게 바꿔주는 babel (plugin들의 모음)
* @babel/preset-react: JSX 문법을 지원하도록 바꿔주는 babel
* babel-loader: babel과 webpack을 연결

***

### `webpack.config.js`
쉬운 설명: **entry**에 있는 파일들을 읽고, 거기에 **module**을 적용한 후 **output**으로 뺀다.

***

### `webpack-dev-server`
코드가 변경되면 `npm run-dev`로 매번 빌드해줘야 된다는 단점을 극복
코드의 변경사항을 감지해서 브라우저에 변경된 점을 자동으로 반영해 준다.
package.json 파일의 scripts 부분에 "dev": "webpack serve --env development" 를 적어준다.

***

### hot reloading
리로딩 시 기존에 입력된 데이터가 날라간다는 단점 극복, 수정된 부분만 리로딩됨.

#### `webpack.config.js` 설정

```
const RefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
```
`npm i @pmmmwh/react-refresh-webpack-plugin` 후 require

```
module: {
  rules: [
    {
      test: /\.jsx?$/,
      loader: "babel-loader",
      options: {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                browsers: ["> 5% in KR"],
              },
              debug: true,
            },
          ],
          "@babel/preset-react",
        ],
        plugins: ["react-refresh/babel"],
      },
    },
  ],
},
```
`plugins: ["react-refresh/babel"]` 추가함으로써 바벨이 최신 자바스크립트를 옛날 자바스크립트로 reloading할 때 hot reloading 기능도 추가함

```
plugins: [
  new webpack.LoaderOptionsPlugin({ debug: true }),
  new RefreshWebpackPlugin(),
],
```
`new RefreshWebpackPlugin()` 추가

```
devServer: {
    devMiddleware: { publicPath: "/dist" },
    static: { directory: path.resolve(__dirname) },
    hot: true,
},
```

`devMiddleware` : 웹팩이 빌드한 파일들이 위치하는 경로
`static` : 실제로 존재하는 정적 파일들의 경로

### controlled Input / uncontrolled Input

controlled Input: 사용자의 입력을 기반으로 자신의 state를 관리하고 업데이트
`value={value} onChange={onChangeInput}` 처럼 value에는 state(상태)가 들어있고, onChange에서 setState(상태 변경)을 하는 형태

uncontrolled Input: value가 onSubmit 내에서만 사용되는 경우 `value={value} onChange={onChangeInput}`를 지워도 동작이 가능함
`defaultValue`를 통해 초깃값 지정이 가능하다.




