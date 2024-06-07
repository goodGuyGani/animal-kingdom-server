const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require("mysql")
const cookieParser = require('cookie-parser')
const session = require('express-session')
const util = require('util')

const app = express()

const port = process.env.PORT || 3001

const simplePDFCert = require("simple-pdf-cert");





app.use(cors({
  origin: ["https://animal-kingdom1.000webhostapp.com", "http://animal-kingdom1.000webhostapp.com", "http://localhost:3000", "http://animalkingdom1.byethost7.com", "https://frontend-practice-4gqv.onrender.com" ],
  methods: ["GET", "POST", "DELETE", "HEAD", "PUT", "PATCH"],
  credentials: true
}));

app.use(cookieParser())

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
  key: "userId",
  secret: "subscribe",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(253402300000000),
  },
}))


const db = mysql.createPool({
  host: 'db4free.net', 
  port: '3306',
  user: 'akdbroot',
  password: 'kiankie123',
  database: 'animalkingdomdb',
  multipleStatements: true
});

/*
const db = mysql.createPool({
  host: 'localhost', 
  user: 'root',
  password: '',
  database: 'animal_kingdom',
});
*/

app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.status(200).send();
});



//MySQL




app.get('/api/get', (req, res) => {

  const sqlSelect = "SELECT * FROM movie_reviews";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

app.get('/api/about', (req, res) => {
  const sqlAbout = "SELECT * FROM about";
  db.query(sqlAbout, (err, result) =>{
    res.send(result);
  });
});

app.get('/api/lessons', (req, res) => {
  const sqlLessons = "SELECT * FROM lessons";
  db.query(sqlLessons, (err, result) => {
    res.send(result);
  });
});

app.get('/api/lessons2/:lessonid', (req, res) => {
  const lessonid = req.params.lessonid
  const sqlLessons = "SELECT * FROM lessons WHERE lessonId = ?";
  db.query(sqlLessons, lessonid, (err, result) => {
    res.send(result);
  });
});

app.get('/api/chapters', (req, res) => {
  const sqlLessons = "SELECT * FROM chapters";
  db.query(sqlLessons, (err, result) => {
    res.send(result);
  });
});

app.post('/api/register', (req, res) => {
  const user = req.body.username
  const name = req.body.name
  const mail = req.body.email
  const pass = req.body.password
  const imgUrl = req.body.imgUrl
  const sqlInsert = "INSERT INTO users (userName, name, userEmail, userPassword, imgUrl) VALUES (?,?,?,?,?)";
  db.query(sqlInsert, [user, name, mail, pass, imgUrl], (err, result) => {
    console.log(result)
  });
})

app.get("/api/login", (req, res) => {
  if (req.session.user){
    res.send({loggedIn: true, user: req.session.user})
  } else {
    res.send({loggedIn: false})
  }
})



app.post('/api/login', (req, res) => {
  const user = req.body.username
  const pass = req.body.password
  const sqlSelect = "SELECT * FROM users WHERE userName = ? AND userPassword = ?";
  db.query(sqlSelect, [user, pass], (err, result) => {
    if (err){
      res.send({err: err})
    } else {
      if (result.length > 0) {
        req.session.user =  result;
        console.log(req.session.user);
        res.send(result)
      } else {
        res.send({message: "Invalid Username or Password"});
      }
    }

  });
})


app.post('/api/checkchapter', (req, res) => {
  const lesson = req.body.lesson
  const chapter = req.body.chapter
  const sqlSelect = "SELECT * FROM chapters WHERE lessonId = ? AND chapterNum = ?";
  db.query(sqlSelect, [lesson, chapter], (err, result) => {
    if (err){
      res.send({err: err})
    } else {
      if (result.length > 0) {
        res.send({message: "Exist"})
      } else {
        res.send({message: "Not Exist"});
      }
    }

  });
})


app.post('/api/checkchapter2', (req, res) => {
  const user = req.body.user
  const lesson = req.body.lesson
  const chapter = req.body.chapter
  const sqlSelect = "SELECT * FROM chapter_state WHERE chapterStateUserId = ? AND chapterStateLessonId = ? AND chapterStateChapterId = ?";
  db.query(sqlSelect, [user, lesson, chapter], (err, result) => {
    if (err){
      res.send({err: err})
    } else {
      if (result.length > 0) {
        res.send({message: "Done"})
      } else {
        res.send({message: "Not Done"});
      }
    }

  });
})


app.get('/api/checkchapterstate', (req, res) => {
  const sqlQuery = "SELECT * FROM chapter_state";
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

app.post('/api/chapstateinsert', (req, res) => {
  const user = req.body.username
  const lesson = req.body.lesson
  const chapter = req.body.chapter
  const sqlInsert = "INSERT INTO chapter_state (chapterStateUserId, chapterStateLessonId, chapterStateChapterId) VALUES (?,?,?)";
  db.query(sqlInsert, [user, lesson, chapter], (err, result) => {
    console.log(result)
  });
})

app.post('/api/galanimal', (req, res) => {
  const userid = req.body.userid
  const imgname = req.body.imgname
  const animalname = req.body.animalname
  const dateidentified = req.body.dateidentified

  const sqlInsert = "INSERT INTO animal_gallery (userId, imgName, animalName, dateIdentified) VALUES (?,?,?,?)";
  db.query(sqlInsert, [userid, imgname, animalname, dateidentified], (err, result) => {
    console.log(result)
  });
})

app.delete("/api/delete1/:chapter", (req, res) => { 
  const chapter = req.params.chapter
  const sqlDelete = "DELETE FROM chapter_state WHERE chapterStateChapterId = ?"
  db.query(sqlDelete, chapter, (err, result) => {
    if (err) console.log(err)

  });
});


app.post("/api/insert", (req, res) => {

  const movieName = req.body.movieName
  const movieReview = req.body.movieReview

  const sqlInsert = "INSERT INTO movie_reviews (movieName, movieReview) VALUES (?,?)";
  db.query(sqlInsert, [movieName, movieReview], (err, result) => {
    console.log(result)
  });
});



app.put("/api/insertcapture", (req, res) => {
  const userid = req.body.userid

  const sqlUpdate = "UPDATE users SET imgCapture = 1 WHERE userId = ?"
  db.query(sqlUpdate, userid, (err, result) => {
    if (err) console.log(err)

  });
});


app.get('/api/fetchbyid/:lessonId', (req, res) => {
  const fetchId = req.params.lessonId;
  db.query('SELECT * FROM lessons WHERE lessonId = ?', fetchId, (err, result) => {
    if(err){
      console.log(err)
    } else {
      res.send(result)
    }
  })
})

app.get('/api/chapstate3/:userid', (req, res) => {
  const userid = req.params.userid;
  db.query('SELECT * FROM chapter_state WHERE chapterStateUserId = ?', userid, (err, result) => {
    if(err){
      console.log(err)
    } else {
      res.send(result)
    }
  })

})


app.get('/api/quiz/:lessonid/:quiznum', (req, res) => {
  const lessonid = req.params.lessonid;
  const quiznum = req.params.quiznum;
  db.query('SELECT * FROM quiz WHERE lessId = ? AND quizNum = ?', [lessonid, quiznum], (err, result) => {
    if(err){
      console.log(err)
    } else {
      res.send(result)
    }
  })
})

app.get('/api/quizcheck/:lessonid', (req, res) => {
  const lessonid = req.params.lessonid;
  db.query('SELECT * FROM quiz WHERE lessId = ? LIMIT 1', lessonid, (err, result) => {
    if(err){
      console.log(err)
    } else {
      res.send(result)
    }
  })
})

app.get('/api/quizcheck2/:lessonid', (req, res) => {
  const lesson = req.params.lessonid
  const sqlSelect = "SELECT * FROM quiz WHERE lessId = ?";
  db.query(sqlSelect, lesson, (err, result) => {
    if (err){
      res.send({err: err})
    } else {
      if (result.length > 0) {
        res.send({message: "Exist"})
      } else {
        res.send({message: "Not Exist"});
      }
    }

  });
})



app.get('/api/checkanswers/:userid/:lessonid', (req, res) => {
  const userid = req.params.userid;
  const lessonid = req.params.lessonid;
  db.query('SELECT COUNT (answerId) AS count FROM answers WHERE userId = ? AND lessonId = ? AND answerState = "Correct" LIMIT 10', [userid, lessonid], (err, result) => {
    if(err){
      console.log(err)
    } else {
      res.send(result)
    }
  })
})

app.get('/api/starcheck/:userid', (req, res) => {
  const userid = req.params.userid;
  db.query('SELECT COUNT (id) AS count FROM animal_gallery WHERE userId = ?', userid, (err, result) => {
    if(err){
      console.log(err)
    } else {
      res.send(result)
    }
  })
})


app.get('/api/quiz2/:lessonid', (req, res) => {
  const lessonid = req.params.lessonid;
  const sqlQuiz = "SELECT * FROM quiz WHERE lessId = ?";
  db.query(sqlQuiz, lessonid, (err, result) => {
    res.send(result);
  });
});

app.post("/api/answers", (req, res) => {

  const userId = req.body.userId
  const lessonId = req.body.lessonId
  const quizNum = req.body.quizNum
  const answerState = req.body.answerState

  const sqlInsert = "INSERT INTO answers (userId, lessonId, quizNum, answerState) VALUES (?,?,?,?)";
  db.query(sqlInsert, [userId, lessonId, quizNum, answerState], (err, result) => {
    console.log(result)
  });
})


app.get('/api/checkchapterstate2/:userid/:lessonid', (req, res) => {
  userid = req.params.userid
  lessonid = req.params.lessonid
  const sqlQuery = "SELECT * FROM chapter_state WHERE chapterStateUserId = ? AND chapterStateLessonId = ? ORDER BY chapterStateChapterId DESC LIMIT 1";
  db.query(sqlQuery, [userid, lessonid],(err, result) => {
    res.send(result);
  });
});

app.get('/api/getgallery/:userid', (req, res) => {
  userid = req.params.userid
  const sqlQuery = "SELECT * FROM animal_gallery WHERE userId = ? ORDER BY id DESC";
  db.query(sqlQuery, userid,(err, result) => {
    res.send(result);
  });
});


app.put("/api/updatechaperstate", (req, res) => {
  const userid = req.body.userid
  const lessonid = req.body.lessonid
  const chapternum = req.body.chapternum
  const sqlUpdate = "UPDATE chapter_state SET chapterStateChapterId =? WHERE chapterStateUserId = ? AND chapterStateLessonId = ?"
  db.query(sqlUpdate, [chapternum, userid, lessonid], (err, result) => {
    if (err) console.log(err)

  });
});

app.delete("/api/deletechapterstate/:userid/:lessonid", (req, res) => {
  const userid = req.params.userid
  const lessonid = req.params.lessonid
  const sqlDelete = "DELETE FROM chapter_state WHERE chapterStateUserId = ? AND chapterStateLessonId = ?"
  db.query(sqlDelete, [userid, lessonid], (err, result) => {
    if (err) console.log(err)

  });
});

app.get('/api/checkchapterstate3/:userid/:lessonid/:chapternum', (req, res) => {
  const userid = req.params.userid
  const lessonid = req.params.lessonid
  const chapternum = req.params.chapternum
  const sqlSelect = "SELECT * FROM chapter_state WHERE chapterStateUserId = ? AND chapterStateLessonId = ? AND chapterStateChapterId = ?";
  db.query(sqlSelect, [userid, lessonid, chapternum], (err, result) => {
    if (err){
      res.send({err: err})
    } else {
      if (result.length > 0) {
        res.send({message: "Exist"})
      } else {
        res.send({message: "Not Exist"});
      }
    }

  });
})


app.get('/api/createcerf/:userid/:lessonid/:user/:lesson', (req, res) => {
  const userid = req.params.userid
  const lessonid = req.params.lessonid
  const user = req.params.user
  const lesson = req.params.lesson

  const name = user.toUpperCase();
  const filename = user + " - " +lesson;

  const sampleData = {
    logo: {
      path: "./logo.png",
    },
    company: {
      name: "Animal Kingdom",
    },
    words: {
      title: "Certificate of Completion",
      h2: "Awarded To",
      awardee: `${name}`,
      reason: `for completing ${lesson} Lesson`,
    },
  };
  
  simplePDFCert(sampleData, `./certificates/${filename}.pdf`);


  const sqlInsert = "INSERT INTO certificate (userId, lessonId, filename) VALUES (?,?,?)";
  db.query(sqlInsert, [userid, lessonid, filename], (err, result) => {
    console.log(result)
  });
})




app.get("/api/getcerf/:name/:lesson", (req, res) => {
  const name = req.params.name
  const lesson = req.params.lesson
  const filename = name + " - " + lesson
  res.download(`./certificates/${filename}.pdf`)
})

app.get('/api/getlesson/:lessonid', (req, res) => {
  lessonid = req.params.lessonid
  const sqlQuery = "SELECT * FROM lessons WHERE lessonId = ? LIMIT 1";
  db.query(sqlQuery, lessonid,(err, result) => {
    res.send(result);
  });
});

app.delete("/api/deleteanswers/:userid/:lessonid", (req, res) => {
  const userid = req.params.userid
  const lessonid = req.params.lessonid
  const sqlDelete = "DELETE FROM answers WHERE userId = ? AND lessonId = ?"
  db.query(sqlDelete, [userid, lessonid], (err, result) => {
    if (err) console.log(err)

  });
});


app.get('/api/selectdistinctlesson/:userid', (req, res) => {
  userid = req.params.userid
  lessonid = req.params.lessonid
  const sqlQuery = "SELECT DISTINCT lessonId FROM answers WHERE userId = ?";
  db.query(sqlQuery, userid,(err, result) => {
    res.send(result);
  });
});





app.delete("/api/delete/:movieName", (req, res) => {
  const name = req.params.movieName
  const sqlDelete = "DELETE FROM movie_reviews WHERE movieName = ?"
  db.query(sqlDelete, name, (err, result) => {
    if (err) console.log(err)

  });
});

app.put("/api/update", (req, res) => {
  const name = req.body.movieName
  const review = req.body.movieReview
  const sqlUpdate = "UPDATE movie_reviews SET movieReview =? WHERE movieName = ?"
  db.query(sqlUpdate, [review, name], (err, result) => {
    if (err) console.log(err)

  });
});

app.post('/api/galanimal2', (req, res) => {

  const userid = req.body.userid
  const imgname = req.body.imgname
  const animalname = req.body.animalname
  const dateidentified = req.body.dateidentified
  const imglink = req.body.imglink

  

  const sqlInsert = "INSERT INTO animal_gallery (userId, imgName, animalName, dateIdentified) VALUES (?,?,?,?)";
  db.query(sqlInsert, [userid, imgname, animalname, dateidentified], (err, result) => {
    console.log(result)
  });


  const fs = require('fs');
  const request = require('request');
  var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){    
  request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

download(`${imglink}`, `./images/${imgname}`, function(){
  console.log('done');
});
});



const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

app.post('/image', upload.single('file'), function (req, res) {
  res.json({})
})

app.use(express.static('public')); 
app.use('/api/images', express.static('images'));

app.use('/', (req, res) => {
  res.send('Welcome to the server')
})

app.listen(port, () => {
  console.log("running on port 3001");
})



/*

//Get all rows
app.get('', (req, res) => {
  pool.getConnection((err, connetion) => {
    if(err) throw err
    console.log(`connected as id ${connetion.threadId}`)

    //query(sqlString, callback)
    connetion.query('SELECT * from beers', (err, rows) => {
      connetion.release() //return connection pool

      if(!err) {
        res.send(rows)
      } else{
        console.log(err)
      }
    })

  })
})

//Get beer by ID
app.get('/:id', (req, res) => {
  pool.getConnection((err, connetion) => {
    if(err) throw err
    console.log(`connected as id ${connetion.threadId}`)

    //query(sqlString, callback)
    connetion.query('SELECT * from beers WHERE id = ?', [req.params.id], (err, rows) => {
      connetion.release() //return connection pool

      if(!err) {
        res.send(rows)
      } else{
        console.log(err)
      }
    })

  })
})



//Listen on environment
app.listen(port, () => console.log(`Listen on Port ${port}`))
*/
