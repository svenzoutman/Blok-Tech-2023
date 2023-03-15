const express = require('express');
const slug = require('slug');
const arrayify = require('array-back');



require('dotenv').config({ path: '.env' });
const PORT = process.env.PORT || 3000;
 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DATABASE_URL;
 
const client = new MongoClient(
 uri, 
 { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }
)
 
client.connect()
 .then((res) => console.log('@@-- connection established'))
 .catch((err) => console.log('@@-- error', err))




/*****************************************************
 * Define some constants and variables
 ****************************************************/

const app = express();
const port = 3000;
const genres = ["Techno", "HardTechno", "House", "EDM", "Drum&Bass", "Dubstep", "Hardcore", "Hardstyle", "Pop", "Hiphop"];
const festivals = [
    
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


app.get('/', async (req, res) => {
  const title  = (festivals.length == 0) ? "No festivals were found" : "festivals";
  
  // RENDER PAGE
  // const title =  "Succesfully added the festival";
  res.render('festivallist', {title, festivals})
});




app.get('/festivals/:festivalId/:slug', (req, res) => {

    // FIND festival
    const id = req.params.festivalId;
    const festival = festivals.find( element => element.id == id);
    console.log(festival);

    // RENDER PAGE
    res.render('festivaldetails', {title: `${festival.name}`, festival});
});


app.get('/festivals/add', (req, res) => {
  res.render('addfestival', {title: "Add a festival", genres});
});


app.post('/festivals/add', async (req, res) => {
  


    const collection = client.db('test').collection('festivals')

    await collection.insertOne({}, {
    })


    console.log("Adding festival: ", festivals);
    // ADD festival 
    festivals.push(festivals);

    // RENDER PAGE
    res.redirect('festivallist', {title: `${festival.name}`, festival});
});





app.get('/festivals/edit', (req, res) => {
    res.render('editfestival', {title: "EDIT ", genres});
  });



app.post('/festivals/edit', async (req, res) => {
  const {
        slug,
        name, 
        year, 
        genres } = req.body

    console.log("Adding festival: ", festivals);
    // ADD festival 
    festivals.push(festivals);

    const collection = client.db('test').collection('festivals')

    await collection.findOneAndUpdate({}, {
        $set: {
            slug: slug,
            name: name,
            year: year,
            genres: genres }
    })

    // RENDER PAGE
    const title =  "Succesfully added the festival";
    res.redirect('festivallist')
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