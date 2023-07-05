## Server Tutorial

# **1일 차**

## 서버 구축

- express 사용하여 서버 생성

- DB와 서버 연결 / POST요청 처리하여 DB에 저장

- DB에서 데이터 가져와 ejs로 보내주기

# **2일 차**

## 기능 추가

- Auto Increment 기능 추가

## **Auto Increment ?**

- **Data를 구분하기 위해** DB에 저장되는 값에 **고유 ID**를 부여하는 것
- 글 번호를 자동으로 지정해주는 기능인데 Mongo DB에는 이 기능이 없어서 데이터의 ID 값을 **총 게시물+1** 로 부여해주는 기능을 만들어봤다.

### **그러나.. 이것은 아주 원초적인 생각이며 버그를 만들어내는 생각이었다.**

> ID를 **총 게시물+1** 로 부여한다면  
> 데이터가 저장되는 시점에 따라 혼선이 생겨서 수정하면 엄청 꼬였다.  
> 그렇기에 데이터의 고유 ID는 수정이 되더라도 영구적으로 남아있는 ID를 부여했다.  
> **총 게시물의 갯수를 관리해주는 컬렉션을 따로 만들어 ID를 관리하게 함**  
> 따라서 한번 부여된 고유ID는 삭제가 되더라도 영원히 그 ID를 가지고 있게 만드는 것이다.

## 2. 데이터를 저장할 때의 좋은 관습

- 데이터에 부여하는 ID는 영구적인 것으로 부여하는 것

# **데이터를 다루는 문법**

## **1. DB에 데이터를 저장 시**

- ## 형태
  db.collection(컬렉션 이름:String).insertOne({저장할 데이터}, function(에러, 결과){})

### 예). HTML의 input에서 title, date 라는 값으로 **POST** 요청을 할 때

```javascript
db.collection('post').insertOne({ \_id: total + 1, title: req.body.title, date: req.body.date }, function (err, result) {
res.sendFile(\_\_dirname + '/write.html');
});
```

## **2. DB의 특정 조건을 가진 데이터 하나를 찾아서 가져올 때**

- ## 형태

```javascript
  db.collection(컬렉션 이름:String).findOne({찾을 데이터의 값}, function (err, result) {})
```

### 예). DB의 count라는 컬렉션에서 데이터 중 이름이 '게시물갯수' 인 값 하나를 찾는 것

```javascript
db.collection("count").findOne(
  { name: "게시물갯수" },
  function (err, result) {}
);
```

## **3. DB의 컬렉션의 모든 데이터를 array 형태로 가져오는 것**

- ## 형태

```javascript
  db.collection(컬렉션 이름:String).find().toArray(function (err, result) {
  }
```

### 예). DB의 post라는 컬렉션의 모든 값을 가져올 때

```javascript
db.collection('post').find().toArray(function (err, result) {
}
```

## **4. DB의 특정 데이터의 값을 UPDATE 할 때**

- ## 형태

```javascript
  db.collection(컬렉션 이름:String).updateOne({ 찾는 데이터 }, { Operator :{어떻게 수정할지} }, function(err, result) {
  })
```

## **Update Operator의 종류**

- {$set: {데이터: 바꿀 값}}
- {$inc: {데이터: 기존값에 더해줄 값}} 등.. 다양한 Operator가 있다

### 예). DB의 count라는 컬렉션의 **name: '게시물갯수'** 인 데이터를 찾아 **totalPost의 값을 +1 하는 것**

```javascript
db.collection("count").updateOne(
  { name: "게시물갯수" },
  { $inc: { totalPost: 1 } },
  function (err, result) {}
);
```

# **3일 차**

## 기능 추가

- list 페이지에서 할 일 완료 기능 추가

## **Ajax**

- Javascript에서 서버와 통신을 할 수 있게 하는 문법
- 최대 장점은 **새로고침**이 없다는 것

### **Jquery를 이용한 Ajax 기본문법**

```javascript
 $.ajax({
 method: "" // PUT, DELETE.. 등의 요청 형태
  url: "" // 서버의 주소
  data: {} // 담아서 보낼 데이터
 }).done(function(result) {
  ~요청이 성공한 후 실행할 코드~
 })
```

# **4일 차**

## 기능 추가

- url Parameter를 이용하여 detail page 제작
- detail Page에 할 일 완료 기능 추가
- 할 일 수정 기능 추가

## **URL Parameter**

외형은 같은 구조지만 데이터는 다른 페이지를 요청할 때 추가해 보내는 인자.
예). detail/1, detail/2

### 형태

```javascript
 app.get('/detail/**:id**(url_parameter)', function(req, res) {
 db.collection('post').findOne({\_id:**req.params.url_parameter**}, function(err, result){

 })
})
```

## **ejs를 통한 조립식 개발**

ejs에 다른 html을 component 형태로 가져와 부착시킬 수 있다.  
다양한 component를 짧은 코드로 부착시킬 수 있다는 장점이 있음.

### 예) navbar를 하나의 component로 하여 list.ejs에 부착시킨다면

- views 폴더 안에 nav.html을 만들고
- list.ejs의 원하는 곳에 <%- include('(파일 경로)nav.html') %> 을 작성하면 navbar가 부착됨.

## **PUT 요청**

- 원래는 html에서 put/delete요청은 사용할 수 없지만,  
  method-override 라이브러리를 사용하여 html의 form에서도 put/delete 요청이 가능해짐.
- npm install method-override 설치 후  
  server.js에 아래와 같이 라이브러리를 등록한다.
  ```javascript
  const methodOverride = require("method-override");
  app.use(methodOverride("_method"));
  ```

### **method-override 사용방법**

- 라이브러리 설치와 server에 등록까지 마쳤다면  
  form 태그 속 action 속성에 action="/경로?**\_method=PUT**" 의  
  형태로 사용된다
- **단 method 속성은 POST로 해야한다.**

예) 어떠한 form 태그에서 **PUT 요청**을 '/put' 경로로 하는 때

```javascript
<form action="/put?_method=PUT" method="POST"></form>
```

- 이후 서버에서는 아래와 같이 요청을 받아 처리한다

예) put요청을 받아 db의 post 컬렉션에서 이러이러한 데이터를 찾아 요청값으로 업데이트 하라는 처리.

```javascript
app.put('/put', function(req, res) {
  db.collection('post').updateOne({req.body.id}, {$set:{title:req.body.title, date:req.body.date}}, function(err, result){
    res.redirect('/list');
  })
})
```

## **요청 처리의 끝에는 서버의 응답이 필수**

- 위의 코드 끝에 **`res.redirect('/list');`** 위의 요청 처리 후  
  유저에게 보내는 응답인데 **/list 페이지를 다시 보내주세요** 라는 뜻이다.
  ### **응답을 작성하지 않으면 페이지는 멈춰버린다**

# **5일차**

## 기능 추가

- 로그인 기능
- session authentication 인증 사용
- passport 라이브러리를 통한 local 방식으로 로그인 정보 검증

  <br/>

# 학습 내용

## 먼저 회원정보 인증 방식들에 대하여 짧게 학습하였다

## **1. session-based-authentication**

- 로그인 할 시, 서버가 Cookie(브라우저에 저장하는 긴 문자열)를 발행
- cookie에는 유저의 session id가 저장되어 있고, 브라우저는 쿠키를 저장해놓음 (로그인 상태 저장)
- 로그인 이후 서버에 **특정 기능(로그인을 해야 이용할 수 있는 기능)을** 요청하면  
  그 요청 속에 유저의 session 정보를 같이 서버에 보낸다.
- 브라우저는 요청한 유저의 session을 검사 후 요청을 처리함.

## 특징

- 유저들의 로그인 상태를 저장해놓는 것이 특징

  <br/>

## **2. JWT Authentication (JSON WEB TOKEN)**

- 유저가 올바른 정보로 로그인을 하면 서버가 브라우저에게 토큰(암호화 된 긴 문자열)을 발행.
- 로그인 이후 서버에 **특정 기능(로그인을 해야 이용할 수 있는 기능)을** 요청하면  
  요청 데이터 속 header에 토큰 정보를 같이 서버에 보낸다.
- 서버는 웹 토큰을 검사 후 통과하면 요청을 처리해줌

## 특징

- 유저들의 로그인 상태를 저장하지 않는 것이 특징 (유통기한이 있는 열쇠를 발급하는 것)

  <br/>

## **3. OAuth**

- 구글이나 카카오 같은 곳에 유저의 정보를 요청하고 유저가 동의하면 서버로 유저의 정보 전달
- 서버가 정보를 받아서 session을 만들던가, token을 발행해주거나 해서 처리

## 특징

- 아주 간편하지만, 몇몇 사이트는 갑자기 **OAuth 로그인 방식이 사라지는 경우가 있다**

  <br/>

# **인증 세팅**

강의는 session 검증 방식으로 진행했기 때문에 session 검증방식으로 진행하였다.

## 1. 먼저 터미널을 열어 아래와 같이 3개의 라이브러리 설치 명령어를 입력 후 설치한다.

> npm i passport passport-local express-session

  <br/>
## 2. 설치 후 server.js 의 상단에 라이브러리를 가져온다.

```javascript
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const session = require("express-session");
```

<br/>

## 3. 요청을 처리할 API를 작성 후 콜백함수 전에 passport의 local 방식 검증 미들웨어를 끼워준다.

```javascript
  //============
  // 로그인 기능
  //============

  // local방식의 회원 정보 검사
  app.post('/login', passport.authenticate('local', {
    failureRedirect: '/fail' // failureRediret: 로그인 실패 시 응답 => /fail로 보내주시오~
    }), function (req, res) {
    res.redirect('/') // 정보 검증이 끝난 후 로그인 요청이 처리되면 // 메인페이지('/')로 보내주시오~
  })
})
```

<br/>

## 4. 미들웨어인 passport를 설정해준다

```javascript
// 1. localstrategy 방식의 검사 - 이것이 완료되면 session에 정보 생성
passport.use(
  new localStrategy(
    {
      usernameField: "id", // 요청에 담겨오는 form의 input 속 name 속성 참조
      passwordField: "pw", // 요청에 담겨오는 form의 input 속 name 속성 참조
      session: true, // 로그인 정보를 세션에 저장할 것인지에 대한 속성
      passReqToCallback: false, // id,pw 외 다른 정보도 검사 할 것인지에 대한 속성
    },
```

<br/>

## **5. 핵심코드\_검증 단계 설정** 🤙

```javascript
    // 1. 본격적인 검사
    // 사용자의 정보 검증 함수

    // 먼저 4번의 속성들 중 usernameField 속성, passwordField 속성, done함수를 인자로 갖는다.
    function (id, pw, done) { // id-usernameField, pw-passwordField,
    // done이라는 함수는 (서버에러, 성공 시 사용자의 DB데이터, 실패 시 에러메세지)를 인자로 갖는다.

      // 1. DB에서 유저가 입력한 id와 같은 데이터가 있으면 가져온다
      db.collection("login").findOne({ id: id }, function (err, result) {
        // 1-1. 에러 처리
        if (err) return done(err);

        // 1-2.결과에 입력 id와 일치하는 것이 없을 때
        if (!result)
          return done(null, false, { message: "존재하지 않는 아이디요" });

        // 1-3. id인증 통과 후
        // DB에서 찾은 데이터에서 pw도 확인
        if (pw == result.pw) { // !! 원래 비밀번호은 암호화 해서 검사해야 한다 !!
          return done(null, result); // 성공 시 result 값은 serializeUser 콜백함수의 첫 인자로 들어감
        } else {
          return done(null, false, { message: "비밀번호 틀렸어요" });
        }
      });
    }
  )
);


// session 데이터를 만들고 유저 정보를 쿠키로 보냄__쿠키 생성
// session에 저장하는 코드__로그인 시 발동
passport.serializeUser(function (user, done) {
  done(null, user.id); // user.id라는 이름으로 session 생성
});

// 요청하는 사람의 session 정보를 가진 사람을 DB에서 찾아달라는 코드__로그인 후 발동
//serailizeUser의 user.id 와 이 콜백함수의 id는 같다
passport.deserializeUser(function (id, done) {
  db.collection("login").findOne({ id: id }, function (err, result) {
    done(null, result);
  });
});
```

<br/>

# 느낀 점

리액트랑 서버랑 연동하는 것도 살짝 어리벙벙 하고 처음에는 너무 막막했다.  
`html` 로 진행 할 때는 `ejs` 같은 편리한 것이 있었는데  
리액트는 `axios`, `uesEffect` 등을 많이 활용하는 기회가 되었다....  
로그인과 회원인증 방식에 대한 학습은 사실 2일이 걸렸다.  
선생님이 원래 원리나 꼭 알아야 할 것은 알려주는데 로그인, 회원인증 강의에서는  
회원가입은 지금 알려줘도 이해 안 된다, 깊게 안 하고 딱 필요한 정도만 알려준다고 하고 강의를 진행했다..  
<br/>

# **고난과 역경** 😫

## **오늘 리액트 포트폴리오에 로그인 기능을 적용하는 중...**

로그인까지는 코드를 충분히 숙지하고 흐름을 파악하여 순조롭게 진행하였고,  
로그인/로그아웃 UI를 변경할 때 서버에서 가져온 데이터로 state를 변경하는 방법을 찾는데  
정말 오래 걸렸다. 처음엔 Cookie를 참조에서 값의 유무에 따라 UI state를 변경할까 했는데  
Cookie는 따로 공부를 해야할 거 같았다. 한 2시간 붙들고 있었는데 도무지 이해가 안 됐기 때문이다.  
결국은 DB에 state 관리를 위한 컬렉션도 새로 만들어서 로그인 상태가 변할 때마다 그 값을 참조하여  
State를 변경하도록 하였다!!!!
