const express = require('express');
const path = require('path');
const app = express();
// EJS 등록
app.set('view engine', 'ejs');

// body-parser (POST요청으로 데이터를 전송하고 싶다면 필요)
app.use(express.urlencoded({ extended: true }));

// PUBLIC 폴더 이용
app.use(express.static(path.join(__dirname, "public")));

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
    req.body._id = parseInt(req.body._id)
    db.collection('post').deleteOne(req.body, function (err, result) {
      console.log(result);
    })
  })
})



app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/write', function (req, res) {
  res.sendFile(__dirname + '/write.html')
})

