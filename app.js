var express    = require('express');
var bodyParser = require('body-parser');
var pdf        = require('html-pdf');
var fs         = require('fs');
var options    = {format:'A4'};
const path = require('path')


//init app
var app = express();

//set the templat engine
// Configure view engine and set views folder
app.set('view engine','ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));

//fetch data from the request
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.render('home')
});

app.post('/',(req,res)=>{
    let now = new Date();
    const fileName = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`
    res.render('demopdf',{data:req.body.article},function(err,html){
        pdf.create(html, options).toFile(`./public/pdfFiles/${fileName}.pdf`, function(err, result) {
            if (err){
                return console.log(err);
            }
             else{
            // console.log(res);
            var datafile = fs.readFileSync(`./public/pdfFiles/${fileName}.pdf`);
            res.header('content-type','application/pdf');
            res.send(datafile);
            console.log(fileName);
             }
          });
    })
})


//assign port
var port = process.env.PORT || 3000;
app.listen(port,()=>console.log('server run at port '+port));

