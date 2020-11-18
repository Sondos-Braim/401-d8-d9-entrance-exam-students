'use strict';
// -------------------------
// Application Dependencies
// -------------------------
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');
var cors = require('cors');


// -------------------------
// Environment variables
// -------------------------
require('dotenv').config();

// -------------------------
// Application Setup
// -------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Application Middleware override
app.use(methodOverride('_method'));

// Specify a directory for static resources
app.use(express.static('./public'));
app.use(express.static('./img'));

app.use(express.static('./img'));

// Database Setup

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

// Set the view engine for server-side templating

app.set('view engine', 'ejs');


// ----------------------
// ------- Routes -------
// ----------------------
app.get('/',homePage);
app.get('/gryffindor/characters',handleGryffindor);
app.get('/hufflepuff/characters',handleHufflepuff);
app.get('/ravenclaw/characters',handleRavenclaw);
app.get('/slytherin/characters',handleSlytherin );
app.post('/fav',insertintoDB);
app.get('/fav',renderFav);
app.get('/fav/:id',renderForm);
app.put('/fav/update/:id',updateChar);
app.delete('/fav/delete/:id',deleteChar);


// --------------------------------
// ---- Pages Routes functions ----
// --------------------------------
function homePage(req,res){
    res.render('home');
}
function handleGryffindor(req,res){
    let arr=[];
    let url='http://hp-api.herokuapp.com/api/characters/house/gryffindor';
    superagent.get(url).then(data=>{
        data.body.map(element=>{
            arr.push(new Character(element));
        })
        res.render('gryffindor',{result:arr});

    });
}
function handleHufflepuff(req,res){
    let arr=[];
    let url='http://hp-api.herokuapp.com/api/characters/house/hufflepuff';
    superagent.get(url).then(data=>{
        data.body.map(element=>{
            arr.push(new Character(element));
        })
        res.render('hufflepuff',{result:arr});

    });
}
function handleRavenclaw(req,res){
    let arr=[];
    let url='http://hp-api.herokuapp.com/api/characters/house/ravenclaw';
    superagent.get(url).then(data=>{
        data.body.map(element=>{
            arr.push(new Character(element));
        })
        res.render('ravenclaw',{result:arr});

    });
}
function handleSlytherin(req,res){
    let arr=[];
    let url='http://hp-api.herokuapp.com/api/characters/house/slytherin';
    superagent.get(url).then(data=>{
        data.body.map(element=>{
            arr.push(new Character(element));
        })
        res.render('slytherin',{result:arr});

    });
}
function insertintoDB(req,res){
    const{image, name, patronus, alive}=req.body;
    let sql='INSERT INTO characters(image, name, patronus, alive) VALUES($1, $2, $3, $4);';
    let safeValues=[image, name, patronus, alive];
    client.query(sql,safeValues).then(()=>{
        res.redirect('/fav');
    });

}
function renderFav(req,res){
    let sql='SELECT * FROM characters;';
    client.query(sql).then(data=>{
        res.render('fav',{result:data.rows});

    });
}
function renderForm(req,res){
    let sql='SELECT * FROM characters WHERE id=$1;';
    let safeValues=[req.params.id];
    client.query(sql,safeValues).then(data=>{
        res.render('character',{element:data.rows[0]});
    })
}
function updateChar(req,res){
    const{image,name,patronus,alive}=req.body;
    let sql='UPDATE characters SET image=$1,name=$2,patronus=$3,alive=$4 WHERE id=$5;';
    let safeValues=[image,name,patronus,alive,req.params.id];
    client.query(sql,safeValues).then(()=>{
        res.redirect(`/fav`);
    })
}
function deleteChar(req,res){
    let sql='DELETE FROM characters WHERE id=$1;';
    let safeValues=[req.params.id];
    client.query(sql,safeValues).then(()=>{
        res.redirect('/fav');
    })
}
//constructor
function Character(data){
    this.image=data.image;
    this.name=data.name;
    this.patronus=data.patronus;
    this.alive=data.alive;
    
}



// Express Runtime
client.connect().then(() => {
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}).catch(error => console.log(`Could not connect to database\n${error}`));
