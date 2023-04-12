/*****************************************************
 * Define some constants and variables
 ****************************************************/
const express = require('express');
const slug = require('slug');
const arrayify = require('array-back');
const app = express();
const festivals = [];
const users = [];
const genres = ["Techno", "HardTechno", "Dance" , "Trance", "House", "EDM", "Drum&Bass", "Dubstep", "Hardcore", "Hardstyle", "Pop", "Hiphop", "Urban"];



/*****************************************************
 * MongoDB Setup
 ****************************************************/

require('dotenv').config({ path: '.env' });
const PORT = process.env.PORT || 3000;
 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DATABASE_URL;
 
const client = new MongoClient( uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  serverApi: ServerApiVersion.v1 }
)
 
client.connect()
 .then((res) => console.log('@@-- connection established'))
 .catch((err) => console.log('@@-- error', err))



/*****************************************************
 * Define the mongodb collections
 ****************************************************/

const collectionFestivals = client.db('matching-app').collection('festivals')
const collectionUpcomingFestivals = client.db('matching-app').collection('upcomingfestivals')
const collectionMijnFestivals = client.db('matching-app').collection('mijnfestivals')
const collectionUsers = client.db('matching-app').collection('users')




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



/*****************************************************
 * All app.get
 ****************************************************/

// Load in data homepage
app.get('/festivals/homepage',  (req, res) => {
  const title =  "Upcoming Festivals";
        collectionUpcomingFestivals.find().toArray()
        .then(resultsUpcoming => {
          console.log(resultsUpcoming)
    res.render('homepage', { title, genres, festivals:resultsUpcoming})
    })
    .catch(error => console.error(error))
});


// Load in data mijn festivals
app.get('/festivals/mylist',  (req, res) => {
  const title =  "festivals";
    collectionMijnFestivals.find().toArray()
      .then(results => {
        console.log(results)
    res.render('myfestivals', { festivals:results, title, genres})
    })
    .catch(error => console.error(error))
});


// Load in data top festivals
app.get('/festivals/topfestivals',  (req, res) => {
  const title =  "festivals";
    collectionFestivals.find().toArray()
      .then(results => {
        console.log(results)
    res.render('topfestivals', { festivals:results, title, genres})
    })
    .catch(error => console.error(error))
});


// Load in data account
app.get('/festivals/account',  (req, res) => {
  const title =  "Account";
    collectionUsers.find().toArray()
      .then(results => {
        console.log(results)
    res.render('account', { users:results, title, genres})
    })
    .catch(error => console.error(error))
});


// Load in edituser form
app.get('/festivals/edituser', (req, res) => {
  res.render('edituser', {title: "Gebruiker Bewerken", genres});
});


// Load in add festival form
app.get('/festivals/add', (req, res) => {
  res.render('addfestival', {title: "Add a festival", genres});
});



/*****************************************************
 * All app.post
 ****************************************************/

// Filter by month on homepage
app.post('/festivals/homepage',  (req, res) => {
  const month = req.body.month;
  collectionUpcomingFestivals.find({ month }).toArray().then((festivals) => {
    res.locals.title = req.body.month;
    res.render("homepage", { festivals, genres });
   });
   
});

// Filter by genres on topfestivals
app.post('/festivals/topfestivals',  (req, res) => {
  const genres = req.body.genres;
  collectionFestivals.find({ genres }).toArray().then((festivals) => {
    res.locals.title = req.body.genre;
    res.render("topfestivals", { festivals, genres });
   });
});


// Update user
app.post('/festivals/edituser', async (req, res) => {
  let user = {
    name: req.body.name, 
    year: req.body.year, 
    genres: arrayify(req.body.genres), 
  };

await collectionUsers.findOneAndUpdate({}, {
  $set: {
      name: req.body.name,
      year: req.body.year,
      genres: arrayify(req.body.genres) }
})

  console.log("Adding user: ", user);
  // ADD user 
  users.push(user);

  // RENDER PAGE
const title =  "Succesfully edited the user";
  res.render('account', {title, users})
});


// Push new festival to the database
app.post('/festivals/add', async (req, res) => {
  let festival = {
    slug: slug(req.body.name),
    img: req.body.img,
    name: req.body.name,
    land: req.body.land,
    plaats:req.body.plaats, 
    year: req.body.year, 
    genres: arrayify(req.body.genres), 
};
    await collectionMijnFestivals.insertOne(req.body)
    .then(result => {
      console.log(result)
    })
    .catch(error => console.error(error))

    console.log("Adding festival: ", festival);
    // ADD festival 
    festivals.push(festival);

    // RENDER PAGE
  const title =  "Succesfully added the festival";
  res.render('myfestivals', {title, festivals})
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

app.listen(PORT, () => {
  console.log('==================================================\n\n')
  console.log(`Webserver running on http://localhost:${PORT}\n\n`);
  console.log('==================================================\n\n')
});