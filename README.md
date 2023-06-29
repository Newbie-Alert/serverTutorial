## Server Tutorial

# 1일 차

## 서버 구축

- express 사용하여 서버 생성

- DB와 서버 연결 / POST요청 처리하여 DB에 저장

- DB에서 데이터 가져와 ejs로 보내주기

# 2일 차

## 1. Auto Increment 기능 추가

- **Data를 구분하기 위해** DB에 저장되는 값에 **고유 ID**를 부여하는 것
- 글 번호를 자동으로 지정해주는 기능인데 Mongo DB에는 이 기능이 없어서 데이터의 ID 값을 **총 게시물+1** 로 부여해주는 기능을 만들어봤다.

### **그러나.. 이것은 아주 원초적인 생각이며 버그를 만들어내는 생각이었다.**

> ID를 **총 게시물+1** 로 부여한다면  
> 데이터가 저장되는 시점에 따라 혼선이 생겨서 수정하면 엄청 꼬였다.  
> 그렇기에 데이터의 고유 ID는 수정이 되더라도 영구적으로 남아있는 ID를 부여했다.  
> 한번 부여된 고유ID는 삭제가 되더라도 영원히 그 ID를 가지고 있게 만드는 것이다.

## 2. 데이터를 저장할 때의 좋은 관습

- 데이터에 부여하는 ID는 영구적인 것으로 부여하는 것

# **데이터를 다루는 문법**

## **1. DB에 데이터를 저장 시**

- ## 형태
  db.collection(컬렉션 이름:String).insertOne({저장할 데이터}, function(에러, 결과){})

### 예). HTML의 input에서 title, date 라는 값으로 **POST** 요청을 할 때

> db.collection('post').insertOne({ \_id: total + 1, title: req.body.title, date: req.body.date }, function (err, result) {
> res.sendFile(\_\_dirname + '/write.html');
> });

## **2. DB의 특정 조건을 가진 데이터 하나를 찾아서 가져올 때**

- ## 형태

  db.collection(컬렉션 이름:String).findOne({찾을 데이터의 값}, function (err, result) {})

### 예). DB의 count라는 컬렉션에서 데이터 중 이름이 '게시물갯수' 인 값 하나를 찾는 것

> db.collection('count').findOne({ name: '게시물갯수' }, function (err, result) {})

## **3. DB의 컬렉션의 모든 데이터를 array 형태로 가져오는 것**

- ## 형태

  db.collection(컬렉션 이름:String).find().toArray(function (err, result) {
  }

### 예). DB의 post라는 컬렉션의 모든 값을 가져올 때

> db.collection('post').find().toArray(function (err, result) {
> }

## **4. DB의 특정 데이터의 값을 UPDATE 할 때**

- ## 형태

  db.collection(컬렉션 이름:String).updateOne({ 찾는 데이터 }, { Operator :{어떻게 수정할지} }, function(err, result) {
  })

- ## Update Operator의 종류
- {$set: {데이터: 바꿀 값}}
- {$inc: {데이터: 기존값에 더해줄 값}} 등.. 다양한 Operator가 있다

### 예). DB의 count라는 컬렉션의 **name: '게시물갯수'** 인 데이터를 찾아 **totalPost의 값을 +1 하는 것**

> db.collection('count').updateOne({name:'게시물갯수'},{$inc : {totalPost:1}},function(err, result){
>
> })

# 3일 차

## **Ajax**

- Javascript에서 서버와 통신을 할 수 있게 하는 문법
- 최대 장점은 **새로고침**이 없다는 것

### **Jquery를 이용한 Ajax 기본문법**

> $.ajax({
> method: "" // PUT, DELETE.. 등의 요청 형태  
>  url: "" // 서버의 주소  
>  data: {} // 담아서 보낼 데이터  
> }).done(function(result) {  
>  ~요청이 성공한 후 실행할 코드~  
> })
