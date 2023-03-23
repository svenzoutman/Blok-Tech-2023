const express = require('express');
const slug = require('slug');
const arrayify = require('array-back');



/*****************************************************
 * MongoDB Setup
 ****************************************************/

require('dotenv').config({ path: '.env' });
const PORT = process.env.PORT || 3000;
 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
const festivals = [];
const genres = ["Techno", "HardTechno", "House", "EDM", "Drum&Bass", "Dubstep", "Hardcore", "Hardstyle", "Pop", "Hiphop"];
const collection = client.db('test').collection('festivals')





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
  const title =  "festivals";
    collection.find().toArray()
      .then(results => {
        console.log(results)
    res.render('festivallist', { festivals:results, title, genres})
    })
    .catch(error => console.error(error))
});


app.get('/festivals/festivallist',  (req, res) => {
  
  collection.find({}).toArray().then((festivals) => {
    res.locals.title = "Festivals";
    res.render("festivallist", { festivals });
   });

});


// app.post('/festivals/festivallist',  (req, res) => {
//   const year = req.body.year;
//   collection.find({ year }).toArray().then((festivals) => {
//     res.locals.title = req.body.year;
//     res.render("festivallist", { festivals, genres });
//    });

// });

app.post('/festivals/festivallist',  (req, res) => {
  const genres = req.body.genres;
  collection.find({ genres }).toArray({}).then((festivals) => {
    res.locals.title = req.body.genres;
    res.render("festivallist", { festivals, genres });
   });

});




// app.get('/festivals/:festivalId', (req, res) => {

//     // FIND festival
//     const id = req.params.festivalId;
//     const festival = festivals.find( element => element.id == id);
//     console.log(festival);

//     // RENDER PAGE
//     res.render('festivaldetails', {title: `${festival.name}`, festival});
// });


app.get('/festivals/add', (req, res) => {

    res.render('addfestival', {title: "Add a festival", genres});
});


app.post('/festivals/add', async (req, res) => {

  let festival = {
    slug: slug(req.body.name),
    name: req.body.name, 
    year: req.body.year, 
    genres: arrayify(req.body.genres), 
};
  
  const collection = client.db('test').collection('festivals')

    await collection.insertOne(req.body)
    .then(result => {
      console.log(result)
    })
    .catch(error => console.error(error))


    console.log("Adding festival: ", festival);
    // ADD festival 
    festivals.push(festival);

    // RENDER PAGE
  const title =  "Succesfully added the festival";
  res.render('festivallist', {title, festivals})
});



app.post("/delete", function (req, res) {
  client.connect((err) => {
    if (err) throw err;
    let query = {
      name: req.body.name,
      address: req.body.address ? req.body.address : null,
      telephone: req.body.telephone ? req.body.telephone : null,
      note: req.body.note ? req.body.note : null,
    };
    client
      .db("test")
      .collection("festivals")
      .deleteOne(query, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        res.send(`Customer ${req.body.name} deleted`);
      });
  });
});



// app.get('/festivals/edit', (req, res) => {

//     res.render('editfestival', {title: "EDIT ", genres});
//   });



// app.post('/festivals/edit', async (req, res) => {
//   const {
//         slug,
//         name, 
//         year, 
//         genres } = req.body

//     console.log("Adding festival: ", festivals);
//     // ADD festival 
//     festivals.push(festivals);

//     const collection = client.db('test').collection('festivals')

//     await collection.findOneAndUpdate({}, {
//         $set: {
//             slug: slug,
//             name: name,
//             year: year,
//             genres: genres }
//     })

//     // RENDER PAGE
//     const title =  "Succesfully added the festival";
//     res.redirect('festivallist')
// });




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