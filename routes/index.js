var express = require('express');
var router = express.Router();
var mongoUrl = 'mongodb://localhost:27017/coffee';
var mongoose = require('mongoose');
var Account = require('../models/accounts');
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
	}

	var newAccount = new Account({
		username: req.body.username,
		password: req.body.password,
		emailAddress: req.body.email
	});

	console.log(newAccount);
	newAccount.save();
	res.json(req.body);
});

module.exports = router;
