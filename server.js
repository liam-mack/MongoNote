const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/notetaker',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

const databaseUrl = "notetaker";
const collections = ["notes"];

// const db = mongojs(databaseUrl, collections);

db.on("error", error => {

  console.log("Database Error:", error);
});

// app.get("/", (req, res) => {
//   res.send(index.html);
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"))
})

app.post("/submit", (req, res) => {
  console.log(req.body);

  db.notes.insert(req.body, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

app.get("/all", (req, res) => {
  db.notes.find({}, (error,data) => {
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
  });
});

app.get("/find/:id", (req, res) => {
  db.notes.findOne(
    {
      _id: mongojs.ObjectId(req.params.id)
    }, 
    (error,data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

app.post("/update/:id", (req, res) => {
  db.notes.update(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      $set: {
        title: req.body.title,
        note: req.body.note,
        modified: Date.now(),
      }
    }, 
    (error,data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

app.delete("/delete/:id", (req, res) => {
  db.notes.remove(
    {
      _id: mongojs.ObjectId(req.params.id)
    }, 
    (error,data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

app.delete("/clearall", (req, res) => {
  db.notes.remove({}, (error,data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

// Listen on port 3000
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
