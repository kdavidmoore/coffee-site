var express = require('express');
var router = express.Router();
var mongoUrl = 'mongodb://localhost:27017/coffee';
var mongoose = require('mongoose');
var Account = require('../models/accounts');
var bcrypt = require('bcrypt-nodejs');
//var session = require('express-session');

mongoose.connect(mongoUrl);

/* post route for register page */
router.post('/register', function(req, res, next){
	if (req.body.password !== req.body.password2){
		res.send({ failure: 'passwordMatch' });
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
		res.json({ sucess: 'added' });
	}
});

/* post route for the login page */
router.post('/login', function(req, res, next){

	Account.findOne(
		{ username: req.body.username },
		function (err, doc){
			if(doc==null){
				res.json({ failure: 'noUser'});
			} else {
				// doc is the document returned from our Mongo query; it has a property for each field.
				// check the password in the db (doc.password) against the submitted password
				var loginResult = bcrypt.compareSync(req.body.password, doc.password);
				if(loginResult){
					// hashes matched
					req.session.username = req.body.username;
					res.json({ success: 'match' });
				}else{
					// hashes did not match or doc not found
					res.json({ failure: 'noMatch' });
				}
			}
	});
});

module.exports = router;
