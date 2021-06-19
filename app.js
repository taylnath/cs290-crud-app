// Basic CRUD app for workout exercises
// Nathan Taylor
// CS290

// get modules etc
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const promisePool = require('./dbcon');
const columnData = require('./columnData');

// define columnData objects
const fields = columnData.fields;
const empty = columnData.empty;
const processEntries = columnData.processEntries;
const textDateToFormDate = columnData.textDateToFormDate;

// define site url
const siteURL = 'http://localhost:3000';

// make express app
const app = express();

// init handlebars engine, also let it be it's own thing
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// static page middleware (for css and js files)
app.use(express.static(path.join(__dirname, 'public')));

// main page route (accessed by browser)
app.get('/', async (req, res, next) => {
  console.log('in get route');
  try{
    // pull entries from database
    let rows = await promisePool('select * from workouts', []);

    // process entries for display
    let entries = processEntries(rows);

    // render the page
    res.render('home', {
      fields: fields,
      values: empty,
      entries: entries,
      siteURL: siteURL
    });
  } catch (err) {
    return next(err);
  }
});

// add route (accessed by fetch)
app.post('/', async (req, res, next) => {
  console.log('in post route');
  try {
    // insert the row
    await promisePool(
      'insert into workouts (name, reps, weight, date, lbs) values (?, ?, ?, ?, ?)',
      ['name', 'reps', 'weight', 'date', 'lbs'].map(x => req.body[x]),
    );

    // get the new table to process and send back to page
    let rows = await promisePool('select * from workouts', []);

    // process entries for display
    let entries = processEntries(rows);

    // make new table, send back to page
    let table = await hbs.render('views/partials/display.handlebars', {
      fields: fields,
      entries: entries
    });

    // send table back to page
    res.send(table);
  } catch (err) {
    return next(err);
  };
});

// delete route (accessed by fetch)
app.delete('/', async (req, res, next) => {
  console.log('in delete route');
  try {
    // delete the row
    await promisePool('delete from workouts where id = ?', [req.body.id]);

    // get the new table to process and send back to page
    let rows = await promisePool('select * from workouts', []);

    // process entries for display
    let entries = processEntries(rows);

    // make new table
    let table = await hbs.render('views/partials/display.handlebars', {
      fields: fields,
      entries: entries
    });

    // send table back to page
    res.send(table);

  } catch (err) {
    return next(err);
  };
});

// route to update a specific row (accessed by fetch)
app.put('/', async (req, res, next) => {
  console.log('in put route');
  try {
    // update the record
    await promisePool(
      'update workouts set name = ?, reps = ?, weight = ?, date = ?, lbs = ? where id = ?',
      ['name', 'reps', 'weight', 'date', 'lbs', 'id'].map(x => req.body[x])
    );

    // success
    // the client redirects back to '/'
    res.send('entry was edited');
  } catch (err) {
    return next(err);
  }
});

// route for editing a specific row, preparing to update (accessed by browser)
app.get('/update', async (req, res, next) => {
  console.log('in update route');
  try {
    // pull entries from database
    let rows = await promisePool('select * from workouts', []);

    // find the entry
    let entryList = rows.filter(e => String(e.id) == req.query.id);

    // process entry for display
    let entry = processEntries(entryList)[0];

    // process date to match html date field
    entry = textDateToFormDate(entry);

    console.log(entry);

    // send response
    res.render('update', {
      fields: fields,
      values: entry,
      siteURL: siteURL
    });
  } catch (err) {
    return next(err);
  }
});

// Simple 404 page
app.use((req,res) => {
  // TODO: make a handlebars template for this page
  res.type('text/plain').status(404).send('404 - Not Found');
});

// simple 500 error page
app.use((err, req, res, next) => {
  console.error(err.stack);
  // TODO: make a handlebars template for this page
  res.type('text/plain').status(500).send('500 - Server Error');
});

// define the port as either the process.env port or 3000
let PORT = process.env.PORT || 3000;

// listen on the port
app.listen(PORT);

// // TODO: take this out?
// // helper route to build table html and send back
// app.get('/table', (req, res) => {
//   console.log('in table');
//   console.log(entries);
//   hbs.render('views/partials/display.handlebars', {
//     fields: fields,
//     entries: entries
//   }).then(table => res.send(table));
// });
