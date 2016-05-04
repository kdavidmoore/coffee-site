var express = require('express');
var router = express.Router();
var mongoUrl = 'mongodb://localhost:27017/coffee';
var mongoose = require('mongoose');
var Account = require('../models/accounts');
var bcrypt = require('bcrypt-nodejs');
//var session = require('express-session');

mongoose.connect(mongoUrl);

/* get route for the home page */
router.get('/', function(req, res, next){
	res.render('index', {});
});

/* get route for register page */
router.get('/register', function(req, res, next){
	res.render('register', { 
		page: 'register',
		failure: req.query.failure
	});
});

/* post route for register page */
router.post('/register', function(req, res, next){
	if (req.body.password !== req.body.password2){
		res.redirect('/register?failure=password');
	} else {
		var salt = bcrypt.genSaltSync(10);

		var newAccount = new Account({
			username: req.body.username,
			password: bcrypt.hashSync(req.body.password, salt),
			emailAddress: req.body.email
		});
		
		console.log(newAccount);
		newAccount.save();
		req.session.username = req.body.username;
		res.redirect('/options');
	}
});

/* get route for options page */
router.get('/options', function(req, res, next){
	if(!req.session.username){
		res.redirect('/login');
	} else {
		res.render('options', {
			page: 'options',
			username: req.session.username
		});
	}
});

/* get route for the login page */
router.get('/login', function(req, res, next){
	res.render('login', { page: 'login' });
});

/* post route for the login page */
router.post('/login', function(req, res, next){

	Account.findOne(
		{ username: req.body.username },
		function (err, doc){
			//doc is the document returned from our Mongo query. It has a property for each field.
			// we need to check the password in the db (doc.password) against the submitted password through bcrypt
			var loginResult = bcrypt.compareSync(req.body.password, doc.password);
			if(loginResult){
				// hashes matched; set up req.session.username and move them on
				req.session.username = req.body.username;
				res.redirect('/options');
			}else{
				// hashes did not match or doc not found; redirect to login
				res.redirect('/login?failure=password')
			}
	});
});

module.exports = router;
