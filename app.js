const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.listen(3000);

app.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});

app.get('/home', (req, res) => {
    res.render('index', {title: 'Home'});
});

app.get('/index', (req, res) => {
    res.render('index', {title: 'Home'});
});

app.get('/wines', (req, res) => {
    res.render('wines', {title: 'Wines'});
});

app.get('/beers', (req, res) => {
    res.render('beers', {title: 'Beers'});
});

app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
});