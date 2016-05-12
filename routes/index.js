var express = require('express');
var router = express.Router();
const mongoUrl = 'mongodb://localhost:27017/coffee';
var mongoose = require('mongoose');
var Account = require('../models/accounts');
var Order = require('../models/orders');
var bcrypt = require('bcrypt-nodejs');
var randtoken = require('rand-token');
// var stripe = require("stripe")(
//   "pk_test_S1PLtt6vW1RchhitC9359CNc"
// );
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
	
	Account.findOne({
		username: req.body.username
	}, function(err, doc){
		if (doc == null){
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

			res.json({
				success: 'added',
				token: token
			});
		} else {
			res.json({ failure: 'notUnique' });
		}
	});
});


/* post route for the login page */
router.post('/login', function(req, res, next){

	Account.findOne(
		{ username: req.body.username },
		function (err, doc){
			if (doc == null){
				// make sure the username is in the database
				res.json({ failure: 'noUser'});
			} else {
				// generate a new token for the current session
				var newToken = randtoken.generate(32);

				// doc is the document returned from our Mongo query; it has a property for each field.
				// check the password in the db (doc.password) against the submitted password
				var loginResult = bcrypt.compareSync(req.body.password, doc.password);
				if (loginResult){
					// password hashes matched, update the token in the db and send it back
					Account.findOneAndUpdate(
						{
							username: req.body.username },
						{
							$set: { token: newToken }
						},
						function (err2, doc2){
							res.json({
								success: 'match',
								token: newToken
							});
					});
				} else{
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


router.post('/payment', function(req, res, next){
	
	// stripe.charges.create({
	// 	amount: req.body.stripeAmount, // obtained with hidden input field
	// 	currency: 'usd',
	// 	source: req.body.stripeToken, // obtained with stripe
	// 	description: "Charge for " + req.body.stripeEmail // obtained with hidden input field
	// }, function(err, charge) {
	// 	if (err && err.type === 'StripeCardError') {
	// 		res.json({failure: 'declined'});
 	//  	} else {
 	// 		res.json({success: 'paid'});
 	// 		}
	// });

	// stripe requires HTTPS for the payment page, so we're going to use some dummy code for now
	
	Account.findOne(
		{
			token: req.body.token
		}, function (err, doc){
			if(doc == null){
				res.json({ failure: 'badToken'});
			} else {
				res.json({ success: 'paid' });
			}
	});
});


router.post('/checkout', function(req, res, next){

	Account.findOne(
	{
		token: req.body.token
	}, function (err, doc){
		if(doc == null){
			res.json({ failure: 'badToken'});
		} else {
			
			var newOrder = new Order({
				token: req.body.token,
				frequency: req.body.frequency,
				quantity: req.body.quantity,
				grindType: req.body.grindType,
				fullname: req.body.fullname,
				addressOne: req.body.addressOne,
				addressTwo: req.body.addressTwo,
				city: req.body.city,
				state: req.body.state,
				zip: req.body.zip,
				deliveryDate: req.body.deliveryDate,
				totalCost: req.body.totalCost
			});

			console.log(newOrder);
			newOrder.save();

			res.json({ success: 'added' });
		}
	});
});


router.post('/cancel', function(req, res, next){

	Account.findOneAndRemove(
		{
			token: req.body.token
		}, function(err, doc){
			if (err){
				res.json({ failure: 'notUpdated' });
			} else {
				res.json({ success: 'removed' });
			}
	});
});


module.exports = router;
