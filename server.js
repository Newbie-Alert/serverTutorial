const express = require('express');
const path = require('path');
const app = express();
const methodOverride = require('method-override');

// method-override_html에서도 put/delete 요청이 가능하게 함
app.use(methodOverride('_method'));
// EJS 등록
app.set('view engine', 'ejs');

// body-parser (POST요청으로 데이터를 전송하고 싶다면 필요)
app.use(express.urlencoded({ extended: true }));

// PUBLIC 폴더 이용 (미들웨어: 요청과 응답 사이에 응답하는 코드)
app.use(express.static(path.join(__dirname, "/public")));
// app.use("/public", express.static('public'));

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
})



app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/write', function (req, res) {
  res.sendFile(__dirname + '/write.html')
})

