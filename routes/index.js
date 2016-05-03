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
	res.render('register', { failure: req.query.failure });
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
	res.render('options', { username: req.session.username });
});

module.exports = router;
