const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app =express();
mongoose.connect('mongodb://0.0.0.0/cats_db', {useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const CatSchema = new mongoose.Schema({
    breedCat: String,
    sizeCat: String,
    coatCat: String,
    colourCat: String
}, {timestamps:true});

const Cat = mongoose.model('Cat',CatSchema)

app.get('/', (req, res) => {
    Cat.find()
    .then(
        cat => {
        res.render('index', {cat});
    })
    .catch(err => res.json(err));
});

app.get('/new_cat', (req, res) => {
    res.render('new_cat', {error: ''});
})

app.post('/', (req, res) => {
    const { breedCat, sizeCat, coatCat, colourCat } = req.body;
    
    const cat = Cat();
    cat.breedCat = breedCat;
    cat.sizeCat = sizeCat;
    cat.coatCat = coatCat;
    cat.colourCat = colourCat;
    
    cat.save()
        .then(() => {
            console.log('save');
            res.redirect('/');
        })
        .catch(err => res.json(err));
});

app.get('/cat/:id', (req,res) => {
    const { id } = req.params;
    Cat.findById(id)
        .then( cat => {
            res.render('info_cat', {cat});
        })
        .catch(err => res.json(err));
})

app.get('/cat/edit/:id', (req, res) => {

    const { id } = req.params;
    Cat.findById(id)
        .then(cat => {
            res.render('edit', { cat, modificado: false });
        })
        .catch(err => res.json(err));
});


app.post('/cat/:id', (req, res) => {
    const { id } = req.params;
    let cat = Cat.findById(id)
    cat.updateOne({_id: req.params.id},req.body)
    .then(data => { 
        if (data.length===0)
            {res.send("<h1>Registro no existe</h1>")}
        else
            {res.redirect("/")} 
    })
    .catch(err => res.json(err));
})


app.post('/cat/destruir/:id', (req, res) => {
    const { id } = req.params;
    let cat = Cat.findById(id)
    cat.remove()
    .then(data => { 
        if (data.length===0)
            {res.send("<h1>Registro no existe</h1>")}
        else
            {res.redirect("/")} 
    })
    .catch(err => res.json(err));
})

const port = 8000;

app.listen(port);
console.log(`server is listening on port ${port}`)