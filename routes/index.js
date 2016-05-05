var express = require('express');
var router = express.Router();
var mongoUrl = 'mongodb://localhost:27017/coffee';
var mongoose = require('mongoose');
var Account = require('../models/accounts');
var Order = require('../models/orders');
var bcrypt = require('bcrypt-nodejs');
var randtoken = require('rand-token');
// create a token generator using the default settings
mongoose.connect(mongoUrl);


/* check for token */
router.get('/getUserData', function(req, res, next){
	// on page load (options, etc.) check for a token
	if(req.query.token == undefined){
		res.json({ failure: 'noToken' });
	} else {
		Account.findOne({
			token: req.query.token
		}, function(err, doc){
			if (doc == null){
				res.json({ failure: 'badToken' });
			} else {
				res.json(doc);
			}
		});
	}
});


/* post route for register page */
router.post('/register', function(req, res, next){
	
	if (req.body.password !== req.body.password2){
		res.send({ failure: 'passwordMatch' });
	} else {
		var salt = bcrypt.genSaltSync(10);
		var token = randtoken.generate(32);

		var newAccount = new Account({
			username: req.body.username,
			password: bcrypt.hashSync(req.body.password, salt),
			emailAddress: req.body.email,
			token: token
		});
		
		console.log(newAccount);
		newAccount.save();
		//req.session.username = req.body.username;

		res.json({
			success: 'added',
			token: token
		});
	}
});


/* post route for the login page */
router.post('/login', function(req, res, next){

	Account.findOne(
		{ username: req.body.username },
		function (err, doc){
			if(doc == null){
				res.json({ failure: 'noUser'});
			} else {
				// doc is the document returned from our Mongo query; it has a property for each field.
				// check the password in the db (doc.password) against the submitted password
				var loginResult = bcrypt.compareSync(req.body.password, doc.password);
				if(loginResult){
					// hashes matched
					//req.session.username = req.body.username;

					res.json({
						success: 'match',
						token: doc.token
					});
				}else{
					// hashes did not match or doc not found
					res.json({ failure: 'noMatch' });
				}
			}
	});
});


/* post route for options page */
router.post('/options', function(req, res, next){

	Account.findOne(
		{ token: req.body.token },
		function (err, doc){
			if(doc == null){
				res.json({ failure: 'badToken'});
			} else {
				res.json({
					success: 'tokenMatch',
					token: doc.token
				});
			}
	});
});


/* post route for delivery page */
router.post('/delivery', function(req, res, next){

	Account.findOne(
		{ token: req.body.token },
		function (err, doc){
			if(doc == null){
				res.json({ failure: 'badToken'});
			} else {
				res.json({
					success: 'tokenMatch',
					token: doc.token
				});
			}
	});	
});


router.post('/checkout', function(req, res, next){
	
	Order.findOneAndUpdate(
		{
			token: $cookies.get('token')
		},
		{
			frequency: $cookies.get('frequency'),
			quantity: $cookies.get('quantity'),
			grindType: $cookies.get('grindType'),
			fullname: $cookies.get('fullname'),
			addressOne: $cookies.get('addressOne'),
			addressTwo: $cookies.get('addressTwo'),
			city: $cookies.get('city'),
			state: $cookies.get('state'),
			zip: $cookies.get('zip'),
			deliveryDate: $cookies.get('deliveryDate')
		},
		{
			upsert: true
		},
		function (err, doc){
			if (doc == null){
				res.json({ failure: 'badToken' });
			} else {
				// found a document and updated it or created one
				// now save the document in the database
				doc.save();
				res.json({ success: 'updated' });
			}
	});
});


module.exports = router;
