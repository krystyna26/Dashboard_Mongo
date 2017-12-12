var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cobraDB'); // name of db
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './static')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));


var AnimalSchema = new mongoose.Schema({ // AnimalSchema = name of db
    name: String,
    teeth: Number,
}, {timestamps: true})

mongoose.model('myAnimal', AnimalSchema);
var Animal = mongoose.model('myAnimal') // Animal = table name?

// show - main page
app.get('/', function(req, res) {
    Animal.find({}, function(err, cobra){ // cobra = row from db
        if (err) {
            console.log(err);
        } else {
            console.log("cobra.......",cobra)
            res.render('index', {cobra_from_templates: cobra});
        }  
    })
 })

// add 
app.get('/cobra/new', function(req, res) {
     res.render('add')
})

// create
app.post('/new', function(req, res) {
     console.log("POST DATA", req.body);
    var new_animal = new Animal({
         name: req.body.name,
         teeth: req.body.teeth
        })
    new_animal.save(function(err, result) {
        if(err) {
            console.log('something went wrong', err);
        } else {
            console.log('successfully added a animal!', result);
            res.redirect('/');
        }
    })
})

// edit
app.get('/edit/:id', function(request, response){
    Animal.find({_id: request.params.id}, function(err, animal){
        console.log("req.params.id", request.params.id)
        console.log("animal", animal);
        response.render('edit', {edited_animal:animal})
    })
   
})

app.post('/edit/:id', function(req, res) {
    Animal.update({_id: req.params.id},{$set:{teeth: req.body.teeth}}, function(err, cobra){ // cobra = row from db
        if (err) {
            console.log(err);
        } else {
            console.log("updated")
            res.redirect('/');
        }  
    })
});

// delete
app.get("/delete/:id", function(req, res){
    Animal.remove({_id: req.params.id}, function(err, animal){
        console.log("req.params.id", req.params.id)
        console.log("animal", animal);
        res.redirect("/")
    })
});

 // Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})