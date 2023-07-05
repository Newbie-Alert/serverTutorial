const express = require('express');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');
const { render } = require('ejs');

// 세션 방식 로그인 기능_미들웨어
app.use(session({ secret: '암호', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// method-override_html에서도 put/delete 요청이 가능하게 함 (미들웨어)
app.use(methodOverride('_method'));

// body-parser_미들웨어 (POST요청으로 데이터를 전송하고 싶다면 필요)
app.use(express.urlencoded({ extended: true }));

// PUBLIC 폴더 이용 (미들웨어: 요청과 응답 사이에 응답하는 코드)
app.use(express.static(path.join(__dirname, "/public")));
// app.use("/public", express.static('public'));

// EJS 등록
app.set('view engine', 'ejs');


// db변수
let db;

// Mongo DB 연결되면 server 8080에 오픈
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://choonsik:asdf1234@cluster0.tpprxr9.mongodb.net/?retryWrites=true&w=majority', function (err, client) {
  // err처리
  if (err) console.log(err)

  // db의 collection 중 todo에 연결
  db = client.db('todo');

  // DB연결 후 Server 오픈
  app.listen(8080, function () {
    console.log('listening on 8080');
  })

  // 유저가 POST요청 시
  app.post('/add', function (req, res) {
    db.collection('count').findOne({ name: '게시물갯수' }, function (err, result) {
      // 총 게시물 갯수를 가져와 변수에 저장
      let total = result.totalPost;
      // 데이터를 저장할 때 총 게시물 갯수+1을 고유 ID로 부여
      db.collection('post').insertOne({ _id: total + 1, title: req.body.title, date: req.body.date }, function (err, result) {
        res.sendFile(__dirname + '/write.html');
      });
      // 기존 count 컬렉션의 총 게시물 갯수에 1을 증가시켜줌
      db.collection('count').updateOne({ name: '게시물갯수' }, { $inc: { totalPost: 1 } }, function (err, result) {
        if (err) { console.log(err) };
      })
    })
  })

  // DB데이터 가져와 EJS로 보내주기, 유저에게 EJS 보내주기
  app.get('/list', function (req, res) {
    db.collection('post').find().toArray(function (err, result) {
      res.render('list.ejs', { posts: result });
    });
  })

  app.delete('/delete', function (req, res) {
    // 서버와 데이터를 주고 받을 때는 문자열로 주고 받기 때문에 요청값을 확인하고 정확한 포맷으로 보내줘야한다.
    req.body._id = parseInt(req.body._id)
    db.collection('count').updateOne({ name: '게시물갯수' }, { $inc: { totalPost: -1 } }, function (err, result) {
      console.log('삭제완료~');
    })
    db.collection('post').deleteOne(req.body, function (err, result) {
      console.log('삭제 완료');
      res.status(200).send({ message: '삭제 완료' });
    })
  })

  app.get('/detail/:id', function (req, res) {
    db.collection('post').findOne({ _id: parseInt(req.params.id) }, function (err, result) {
      res.render('detail.ejs', { data: result })
    })
  })

  app.get('/edit/:id', function (req, res) {
    db.collection('post').findOne({ _id: parseInt(req.params.id) }, function (err, result) {
      res.render('edit.ejs', { data: result })
    })
  })

  app.put('/put', function (req, res) {
    db.collection('post').updateOne({ _id: parseInt(req.body.id) }, { $set: { title: req.body.title, date: req.body.date } }, function (err, result) {
      console.log(result.body);
      res.redirect('/list');
    })
  })

  //============
  // 로그인 기능
  //============
  app.get('/sign-in', function (req, res) {
    res.render('login.ejs');
  })
  // local방식의 회원 정보 검사
  // failureRediret: 로그인 실패 시 응답
  app.post('/login', passport.authenticate('local', { failureRedirect: '/fail' }), function (req, res) {
    res.redirect('/')
  })
})

// 1. localstrategy 방식의 검사 - 이것이 완료되면 session에 정보 생성
passport.use(new localStrategy({
  usernameField: 'id', // form의 input 속 name 속성 참조
  passwordField: 'pw', // form의 input 속 name 속성 참조
  session: true, // 로그인 정보를 세션에 저장할 것인지
  passReqToCallback: false, // id,pw 외 다른 정보도 검사하고 싶다면 true
},

  // 2. 검사 단계
  // 사용자의 정보 검증 단계_중요
  function (id, pw, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: id }, function (err, result) {
      // done(서버에러, 성공 시 사용자의 DB데이터, 실패 시 에러메세지)
      // 에러 처리
      if (err) return done(err)
      // 결과에 입력 id와 일치하는 것이 없다
      if (!result) return done(null, false, { message: '존재하지 않는 아이디요' })
      // DB에 일치하는 데이터가 있다면 pw 확인
      // 비번은 암호화 해서 검사해야 한다.
      if (pw == result.pw) {
        return done(null, result) // 성공 시 result 값은 serializeUser 콜백함수의 첫 인자로 들어감
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));


function checkLogin(req, res, next) {
  if (req.user) {
    next()
  } else {
    res.send('로그인 안 함')
  }
}

app.get('/mypage', checkLogin, function (req, res) {
  req.user //deserialize에서 온 user 정보
  console.log(req.user)
  res.render('mypage.ejs', { user: req.user })
})
// session에 저장하는 코드
passport.serializeUser(function (user, done) {
  done(null, user.id) // user.id라는 이름으로 session 생성
  // session 데이터를 만들고 세션의 id라는 정보를 쿠키로 보냄
  // 쿠키 생성
});

// 요청하는 사람의 session 정보를 가진 사람을 DB에서 찾아달라는 코드
// 나중에 발동
//serailizeUser의 user.id 와 이 콜백함수의 id는 같다
passport.deserializeUser(function (id, done) {
  db.collection('login').findOne({ id: id }, function (err, result) {
    done(null, result)
  })

})


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/write', function (req, res) {
  res.sendFile(__dirname + '/write.html')
})

