/* eslint-disable no-undef */
// const express = require('express')
// const app = express()
// const port = 3000

// app.set('view engine', 'ejs')

// app.get('/', (req, res) => {
//     res.render('pages/index')
// })
// app.listen(port, () => {
//   console.log(`App listening at port ${port}`)
// })

const express = require('express');
const slug = require('slug');
const arrayify = require('array-back');

/*****************************************************
 * Define some constants and variables
 ****************************************************/

const app = express();
const port = 3000;
const genres = ["Techno", "HardTechno", "House", "EDM", "Drum&Bass", "Dubstep", "Hardcore", "Hardstyle", "Pop", "Hiphop"];
const festivals = [
        {
                "id": 1,
                "slug": "soenda-festival",
                "name": "Soenda Festival",
                "year": "2022",
                "genres": ["Techno", "House", "Disco"],
        },
];

/*****************************************************
 * Middleware
 ****************************************************/
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


/*****************************************************
 * Set template engine
 ****************************************************/
app.set('view engine', 'ejs');


/*****************************************************
 * Routes
 * 
 * GET /                        
 *   home - show festivallist
 * GET /festivals/:festivalId/:slug   
 *   show festival details
 * GET /festivals/add              
 *   show form to add festival
 * POST /festivals/add             
 *   add festival and show festivallist
 ****************************************************/


app.get('/',  (req, res) => {
    // RENDER PAGE
    const title  = (festivals.length == 0) ? "No festivals were found" : "festivals";
    res.render('festivallist', {title, festivals});
});

app.get('/festivals/:festivalId/:slug', (req, res) => {

    // FIND festival
    const id = req.params.festivalId;
    const festival = festivals.find( element => element.id == id);
    console.log(festival);

    // RENDER PAGE
    res.render('festivaldetails', {title: `festivaldetails for ${festival.name}`, festival});
});


app.get('/festivals/add', (req, res) => {
  res.render('addfestival', {title: "Add a festival", genres});
});


app.post('/festivals/add', (req, res) => {
    let festival = {
        slug: slug(req.body.name),
        name: req.body.name, 
        year: req.body.year, 
        genres: arrayify(req.body.genres), 
    };
    console.log("Adding festival: ", festival);
    // ADD festival 
    festivals.push(festival);
    // RENDER PAGE
    const title =  "Succesfully added the festival";
    res.render('festivallist', {title, festivals})
});


/*****************************************************
 * If no routes give response, show 404 Page
 ****************************************************/

app.use(function (req, res) {
    console.error("Error 404: page nog found");
    res.status(404).render('404', {title: "Error 404: page not found"});
});


/*****************************************************
 * Start webserver
 ****************************************************/

app.listen(port, () => {
  console.log('==================================================\n\n')
  console.log(`Webserver running on http://localhost:${port}\n\n`);
  console.log('==================================================\n\n')
});
