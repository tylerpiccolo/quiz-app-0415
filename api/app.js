var express = require("express");
var app = express();
var db;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:dbUserPassword@cluster0.gaki5.mongodb.net/cmps415?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  console.log("Connected to DB");
  db = client.db();
});

const cors = require("cors");

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ["GET", "POST", "PUT", "DELETE"]
}

// Middleware 
app.use(cors(corsOptions));
app.use(express.json())

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

app.get('/', (req, res) => res.send('Quiz App. Connect to an endpoint. (Postman.)'));

// get all quizzes 
app.get("/quizzes/", function (req, res) {
  db.collection("quiz").find({}).toArray(function (err, quizzes) {
    if (err) {
      handleError(res, err.message, "Failed to get quizzes.");
    } else {
      res.status(200).json({ quizzes: quizzes });
    }
  });
});

// create new quiz
app.post("/new/", function (req, res) {

  if (req.body.title === "" || req.body.description === "" || req.body.questions == null) {
    console.log("you need to add a title / description")
    res.status(400).json({ msg: "missing parameters like title, description, quesitons, etc" })
    return
  }

  var newQuiz = {
    title: req.body.title,
    description: req.body.description,
    questions: req.body.questions
  }

  console.log(newQuiz);
  db.collection("quiz").insertOne(newQuiz, function (err, quiz) {
    if (err) {
      handleError(res, err.message, "Failed to create new quiz.");
    } else {
      res.status(201).json({ msg: "quiz created" });
    }
  });
}
);

// get a single quiz and submissions 
app.get("/quiz/:id", async function (req, res) {
  var id = req.params.id

  const [quizzes, submissions] = await Promise.all([
    db.collection('quizzes').findOne({ _id: id }),
    db.collection('submission').find({ quiz_id: id }).toArray()
  ]);

  res.status(200).json({ quiz_id: id, submissions: submissions, questions: quizzes })
});

// get a single quiz
app.get("/take-quiz/:id", async function (req, res) {
  var id = req.params.id
  var ObjectID = require('mongodb').ObjectID;
  var objId = new ObjectID(id);

  const [quizzes] = await Promise.all([
    db.collection('quiz').findOne({ _id: objId }),
  ]);

  res.status(200).json({quiz: quizzes })
});


// create one submission 
app.post("/quiz/:id", function (req, res) {
  var quiz_id = req.params.id

  var newSubmission = {
    quiz_id: quiz_id,
    answers: req.body.answers
  }

  db.collection("submission").insertOne(newSubmission, function (err, submission) {
    if (err) {
      handleError(res, err.message, "Failed to get submission.");
    } else {
      res.status(200).json({ msg: "submission created" });
    }
  });
});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}
