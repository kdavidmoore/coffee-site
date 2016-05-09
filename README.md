# Coffee Site - Back End Component

## API built in Node.js using Express

The back end component receives http requests from the [front end](https://github.com/kdavidmoore/coffee2-angular) and responds by creating, updating, retreiving, or deleting user data. User data is stored in a MongoDB database using Mongoose Schemas.

## Features
* Creates Mongoose Schemas named Account and Order
* Stores new user data as a new Account with a token
* Uses token to retrieve and update user data with new info posted from front end
* Sends back an error message if the token posted is not found or does not match the token found in the database
* A new order is linked to an account by its token

## [Demo here](http://kdavidmoore.com/coffee)

## See also
* [Coffee Site - Front End Component](https://github.com/kdavidmoore/coffee2-angular)

[I learned this at DigitalCrafts](https://digitalcrafts.com)