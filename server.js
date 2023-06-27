const express = require('express');
const path = require('path');
const app = express();
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
    db.collection('post').insertOne({ name: req.body.title, date: req.body.date }, function (err, result) {
      res.sendFile(__dirname + '/write.html');
    });
  })

  // DB데이터 가져와 EJS로 보내주기, 유저에게 EJS 보내주기
  app.get('/list', function (req, res) {
    db.collection('post').find().toArray(function (err, result) {
      console.log(result);
      res.render('list.ejs', { posts: result });
    });

  })
})



// body-parser (POST요청으로 데이터를 전송하고 싶다면 필요)
app.use(express.urlencoded({ extended: true }));

// PUBLIC 폴더 이용
app.use(express.static(path.join(__dirname, "public")));



app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/write', function (req, res) {
  res.sendFile(__dirname + '/write.html')
})

