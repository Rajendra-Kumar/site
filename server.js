var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var request = require('request');
var body = require('body-parser');
var mysql = require('mysql');
var stylus = require('stylus');
var app = express();
app.use(body());
app.set('view engine', 'ejs');

///////////////////////////////////////////////////////////////////////////////////////// MIDDLEWARE
app.use(express.static(__dirname + '/public'));

app.set('views',__dirname + '/views');

app.use(session({secret: 'ssshhhhh'}));
///////// data base coneect //////////
 var connection = mysql.createConnection({
 	host: 'localhost',
 	user: 'root',
 	password: '',
 	database: 'site'
 });

connection.connect( function (err){
 if (!err) {
 	console.log('Database is connect.....\n\n');
 }
 else{
 	console.log('Database is not connect......\n\n');
 }
});

app.get('/', function (req, res) {
  res.render('./index.ejs');
  
});


var sess;

app.get('/',function(req,res){
	sess=req.session;
		//Session set when user Request our app via URL
		if(sess.email)
		{
		/*
		* This line check Session existence.
		* If it existed will do some action.
		*/
		res.redirect('/homepage');
		}
		else{
		res.render('./login.ejs');
		}
});


app.get('/signup', function (req, res) {
  res.render('./signup.ejs');
  
});
app.get('/login', function (req, res) {
	res.render('./login.ejs');
});

app.post('/login', function (req, res) {

	var Name=req.body.name;
      	var Email=req.body.email;
      	var UserName=req.body.username;
      	var Password=req.body.password;
      	var Mobile=req.body.mobile;
    

      	connection.query("SELECT * FROM site_table WHERE ?",{Email:Email}, function (err,result){
				if(result.length)
				{
      				res.send('User Exist:Plz Try Again');
      				console.log('User Exist');
				}
					
				
			else
			{

			    connection.query("INSERT INTO site_table SET ?",{Name:Name,Email:Email,UserName:UserName,Password:Password,Mobile:Mobile}, function (error,data){
				    if(error){

				      console.log("message are ="+error.message);
				    }else{

				    sess=req.session;
					//In this we are assigning email to sess.email variable.
					//email comes from HTML page.
					sess.email=Email;
				   	 console.log(' New User Crete');
				     res.render('./login.ejs');

				    }
				});

      			
			}
		});
  
});

/*app.get('/homepage', function (req, res) {
  res.render('./homepage.ejs');
  
});*/


app.post('/homepage', function (req, res) {
	
	var Email=req.body.email
	var password=req.body.password

	sess=req.session;
	sess.email=Email;

	console.log(Email)
	console.log(password)
		
	
	connection.query("SELECT * FROM site_table WHERE ?",{Email:Email}, function (err,result){
		if(result.length)
		{
			
			console.log("hello usertable "+result);

			connection.query("SELECT * FROM site_table ", function (err,result){
			
			if(err)
			{
			 	 throw err;
				 console.log('inr '+error);
			 }
			    else{
			    res.render('./homepage.ejs');

			    }
			});
		}

		else
		{
			
			res.send('Plz Corrct Email:');
			console.log('wroung Email :');
		}
	});

	

});

app.get('/logout', function (req,res){
	req.session=null;
	res.redirect('/login');
});

app.listen(8000);
console.log("server started at 8000");

