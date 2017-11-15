var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var db;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded(
    {extended: true}
    )
)

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    db.collection('quotes').find().toArray((err, result) => {
        if (err) return console.log(err);
        //render index.ejs
        res.render('index', {
            quotes:result
        })
    });
});

app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err);
    
    console.log('saved to database');
    res.redirect('/');
    })
}); 

app.put('/quotes', (req, res) => {
    db.collection('quotes')
    .findOneAndUpdate({name: 'Yoda'}, {
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  });

  app.delete('/quotes', (req, res) => {
    db.collection('quotes').findOneAndDelete({name: req.body.name},
    (err, result) => {
      if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
    })
  });

var url = 'mongodb://localhost:27200/mongoexpresscrud'; //connect method to connect to the Server
MongoClient.connect(url, (err, database) => {
    if (err) return console.log(err);

    db = database;

    app.listen(3500, () => {
      console.log('listening on 3500');
        });
    })