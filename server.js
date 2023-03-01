const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const fs = require('fs');
const options = { format: 'A4' };
const path = require('path');

// debug & logs 'middleware'
const morgan = require('morgan');
app.use(morgan('dev'));

// db model import
const db = require('./mongo-db/dbConnect');

// set the template engine and set views folder
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));

// fetch data from the request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
  res.send(`<title>RjRaju</title>
  <center><h1>Hello Developer</h1>
  <a href="/code">click here</a></center>`)
})

app.get('/code',(req,res)=>{
  res.render('home')
});

//// Report PDF
app.post('/Reports', async(req, res) => {
    const data = new db({
      empid:req.body.articleId,
      name:req.body.articleName,
      address:req.body.articleAddress
    })
    const userData = await data.save();
    console.log(userData);
  let now = new Date();
  const fileName = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
  res.render('demopdf', {
    dataId: req.body.articleId,
    dataName: req.body.articleName,
    dataAddress: req.body.articleAddress
  },function (err, html) {
    pdf.create(html, options).toFile(`./public/pdfFiles/${fileName}.pdf`, function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        var datafile = fs.readFileSync(`./public/pdfFiles/${fileName}.pdf`);
        res.contentType('application/pdf');
        res.send(datafile);
        console.log(fileName);
      }
    });
  });
});

app.get('/Report/:id',(req,res)=>{
  res.send(`still in dev.. stage..`)
})


// // Report PDF ORIGNALLL
// app.post('/Reports', (req, res) => {
//   let now = new Date();
//   const fileName = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
//   res.render('demopdf', {
//     dataId: req.body.articleId,
//     dataName: req.body.articleName,
//     dataAddress: req.body.articleAddress
//   }, function (err, html) {
//     pdf.create(html, options).toFile(`./public/pdfFiles/${fileName}.pdf`, function (err, result) {
//       if (err) {
//         console.log(err);
//         res.status(500).send('Internal Server Error');
//       } else {
//         var datafile = fs.readFileSync(`./public/pdfFiles/${fileName}.pdf`);
//         res.contentType('application/pdf');
//         res.send(datafile);
//         console.log(fileName);
//       }
//     });
//   });
// });






//////// API /////////

// post
app.post('/api/data', async (req, res) => {
  const data = new db({
    empid: req.body.empid,
    name: req.body.name,
    address: req.body.address
  });
  try {
    const values = await data.save();
    res.json(values);
    console.log(values);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// fetch all data 
app.get('/api/data', async (req, res) => {
  try {
    const data = await db.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// data fetch using id
app.get('/api/data/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = await db.findById(id);
    if (data) {
      res.json(data);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// 404 not found
app.use((req, res) => {
  res.status(404).send(`<center><h1>404 not found !</h1></center>`);
});

// port
var port = process.env.PORT || 8899;
app.listen(port,()=>{
  console.log(`server listening on http://127.0.0.1:${port}`)
});


