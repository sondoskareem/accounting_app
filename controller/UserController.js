'use strict';
const Joi = require('joi');
const mongoose = require('mongoose');
var moment = require('moment');
var Email = require('../models/email');
var UserValidation = require('../validation/UserValidation');
const bcrypt = require('bcrypt');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
var nodemailer = require('nodemailer');
let {User, Income_wallet , Client ,Client_debt } = require('../models/users')

exports.create_a_User = function (req, res) {
	const validating = UserValidation.new_user(req.body);
	if (validating.error) {
	  res.status(401).send({
		msg: validating.error.details[0].message
	  })
	} else {

		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(req.body.password, salt);
		var shortID = shortid.generate()
			const user = new User({
				_id: new mongoose.Types.ObjectId(),
				email: req.body.email.toLowerCase(),
				password: hash,
				name: req.body.name,
				IQ_wallet: 0,
				Dollars_wallet: 0,
				isActive:true,
				uptime: moment().format('DD/MM/YYYY')
			  });
				// console.log('1')
			  	// console.log(user)
			  user.save()
			  .then(result =>{
				// console.log('1000')
				var transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
					  user: 'alwaan.reset@gmail.com',
					  pass: 'm1n2b33v11'
					},
					tls: {
					  rejectUnauthorized: false
					}
				  });
				//   console.log('2000')
	  
				  var mailOptions = {
					from: 'alwaan.reset@gmail.com',
					to: req.body.email,
					subject: 'conform password',
					html: `<p> Conform email code :  \n <h2> ${shortID} </h2></p>`
				  };
				//   console.log('3000')
	  
				  transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						// console.log(error)
					  res.status(400).send({ msg: 'err' })
					} else {
						// console.log('inside222')
					  const email = new Email({
						_id: new mongoose.Types.ObjectId(),
						code: shortID,
						user_id: result._id,
						exp: moment().add(1, 'hours').format('llll')
					  })
				//   console.log('4000')

					  email.save()
						.then(result1 => {
						  res.status(200).send({ msg: "Done . user added , check your email" })    //***********************
						})
						.catch(err => {
							res.status(400).send({msg:'err'})
						})
					}
				  });

			  })
			  .catch(err =>{
				var msg
				if(err.name === 'MongoError' && err.code === 11000){
				if( err.errmsg.includes("$name_1 dup key")){
				   msg = "name duplicated"
				  }else if(err.errmsg.includes("$phone_1 dup key")){
					 msg = "phone duplicated"
				 }else if(err.errmsg.includes("$email_1 dup key")){
				   msg = "email duplicated"
				  }else{
					   msg = err
				  } 
				}
				 res.status(400).send({ msg: msg });
			  })
	}  
}
exports.create_client = function (req, res) {
	const validating = UserValidation.new_client(req.body);
	if (validating.error) {
	  res.status(401).send({msg: validating.error.details[0].message
	  })
	} else {
		console.log('/')
			const client = new Client({
				_id: new mongoose.Types.ObjectId(),
				name: req.body.name,
				phone: req.body.phone,
				city: req.body.city,
				user_id:req.checklogin._id,
				uptime: moment().format('DD/MM/YYYY')
			  });
			  console.log('/')
			  client.save()
			  .then(result =>{
				  console.log(result._id)
				const client_debt = new Client_debt({
					_id: new mongoose.Types.ObjectId(),
					client_id: result._id,
					Dollars_amount_left: 0,
					Dollars_amount_back:0,
					user_id:req.checklogin._id,
					uptime: moment().format('DD/MM/YYYY')
				})
				client_debt.save()
				.then(result00 =>{res.status(200).send({msg:'done'})})
				.catch(err=>{res.status(400).send({msg:err})})
			  })
			  .catch(err =>{
				  res.status(400).send({msg:err})
			  })
	}  
}
///////////////////////////////////////////////
exports.loginUser = function (req, res) {
	if (req.body.email && req.body.password) {
		  User.find({ email: req.body.email })
			.then(result => {
				var usercheck = bcrypt.compareSync(req.body.password, result[0].password);
          if (usercheck) {
             if(result[0].isActive){ 
				 var token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (32832000),
                id: result[0]._id,
              }, '____z0@kjafsjawdjjkjkwejDsdsdsd');
             
			  res.status(200).send({token: token})
			}res.status(401).send({msg:'You must first confirm your email'})

		}else{
			res.status(400).send({msg:'incorrect userName or password'})
		}
	})
	.catch(err =>{
		res.status(400).send({msg:'incorrect userName or password'})
	})
	}else{
		res.status(400).send({msg:'email and password required'})
	}
}
///////////////////////////////////////////////////
exports.confirm_email = function (req, res) {
	Email.find({ code: req.body.code })
	  .then(result => {
		if (result.length == 0) {
		  res.status(400).send({ msg: "Wrong , check your code" })
		} else {
		//   console.log("exp " + result[0].exp)
		//   console.log(result[0].user_id)
		  var ex = moment((new Date(68[0].exp))).format('llll');
		  var now = moment(Date.now()).format('llll');
		  var ex1 = new Date(ex)
		  var now1 = new Date(now)
		//   console.log('ex1   ' + ex1)
		//   console.log('now1   ' + now1)
		  if (moment(now1).isSameOrAfter(moment(ex1))) {
			Email.deleteOne({ code: req.body.code })
			  .then(resultt => {
				res.status(400).send({ msg: 'Try again later' })
			  })
			  .catch(err => {
				res.status(400).send({ msg: 'Somthing went wrong' })
			  })
		  } else {
			User.updateOne({
			  _id: result[0].user_id
			}, {
				$set: {
				  "isActive": true,
				}
			  }, {
				new: true
			  })
			  .then(result2 => {
			  })
			  .catch(err => {
				res.status(400).send({ msg: 'err' })
			  });
  
			Email.deleteMany({ user_id: result[0].user_id })
			  .then(result3 => {
			  })
			  .catch(err => {
			  })
			res.status(200).send({ msg: 'Account confirmed . please login again' })
		  }
		}
	  })
	  .catch(err => {
  
	  })
}
  //////////////////////////////////////////resend code 
exports.resend_code = function (req, res) {
	User.find({ email: req.body.email })
	  .then(result => {
		if (result == 0) {
		  res.status(400).send({ msg: 'No users found with this email' })
		} else {
		  var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			  user: 'alwaan.reset@gmail.com',
			  pass: 'm1n2b33v11'
			},
			tls: {
			  rejectUnauthorized: false
			}
		  });
		  // console.log('var mailOptions')
		  var shortID = shortid.generate()
		  var mailOptions = {
			from: 'alwaan.reset@gmail.com',
			to: req.body.email,
			subject: 'conform password',
			html: `<p> Conform email code :  \n <h2> ${shortID} </h2></p>`
		  };
		  // console.log('var sendMail')
  
		  transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
			  res.status(400).send({ msg: 'err' })
			  // console.log('error');
			} else {
			  // console.log(result._id)
			  // var shortID = shortid.generate()
			  const email = new Email({
				_id: new mongoose.Types.ObjectId(),
				code: shortID,
				user_id: result[0]._id,
				exp: moment().add(1, 'hours').format('llll')
			  })
			  email.save()
				.then(result1 => {
				  res.status(200).send({ msg: "Code has been sent , check your email" })    //***********************
				})
				.catch(err => {
				  res.status(400).send({ msg: 'err' })
				})
			}
		  });
		}
	  })
	  .catch(err => {
		res.status(400).send({ msg: 'err' })
	  })
  
}
exports.update_password = function (req, res) {
	User.find({ _id: req.checklogin._id })
	  .then(result => {
		if (req.body.password && req.body.new_password) {
		  var usercheck = bcrypt.compareSync(req.body.password, result[0].password);
		  if (usercheck) {
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(req.body.new_password, salt);
			User.updateOne({
			  _id: req.checklogin._id
			}, {
				$set: {
				  "password": hash,
				}
			  }, {
				new: true
			  })
			  .then(result => {
				res.status(200).send({ res: 'Password has been changed' })
			  })
			  .catch(err => {
				res.status(400).send({ msg: 'err' })
			  });
		  } else {
			res.status(400).send({ res: 'Password not correct' })
		  }
		}
		else {
		  res.status(400).send({ res: 'You must enter the required field' })
		}
	  })
	  .catch(err => {
		res.status(400).send({ msg: err })
	  })
}
///////////////////////////////////////////////////////
exports.wallet_info = function(req , res){
	  User.find({_id:req.checklogin._id})
	  .select('  IQ_wallet  Dollars_wallet  ')
	  .then(result =>{
		res.status(200).send({info:result})
	  })
	  .catch(err =>{
		  res.status(400).send({msg:'err'})
	  })
}
exports.check_login = function (req , res) {
	User.find({_id : req.checkLogin_admin._id})
	.then(result =>{
		// console.log(result.length)
		if(result.length == 0){
			res.status(401).send({admin : false})
		}else if(result.length != 0){
			res.status(200).send({admin : true})
		}
	})
	.catch(err =>{
		res.status(401).send({msg:'user not found'})
	})
	
}