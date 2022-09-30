
const mongoose = require('mongoose');
var moment = require('moment');
var DebtValidation = require('../validation/DebtValidation');
let {User, Income_wallet , Client ,Client_debt } = require('../models/users')

exports.inc = function(req , res) {
	const validating = DebtValidation.income_wallet(req.body);
	if (validating.error) {
		res.status(401).send(validating.error.details[0].message)
	} else {
		var time = new Date(req.body.time)
		var ISOTime = time.toISOString()
		const income_wallet = new Income_wallet({
			_id: new mongoose.Types.ObjectId(),
			description:req.body.description,
			IQ_amount : req.body.IQ_amount,
			Dollar_amount : req.body.Dollar_amount,
			operation:1,
			inc_exp:true,
			time: req.body.time,
			uptime : ISOTime,
			user_id:req.checklogin._id
		})
		var IQ_wallet = parseInt(req.checklogin.IQ_wallet) + parseInt(req.body.IQ_amount)
		var Dollars_wallet = parseInt(req.checklogin.Dollars_wallet) + parseInt(req.body.Dollar_amount)
		income_wallet.save().then(result=>{

			User.updateOne({_id:req.checklogin._id}, {
				$set: {
				"IQ_wallet": IQ_wallet,
				"Dollars_wallet": Dollars_wallet,
				}}, {
				new: true}).then(result => {}).catch(err => {res.status(400).send({msg:'err'})});
			res.status(200).send({msg:'Income added'})
		}).catch(err=>{res.status(400).send({msg:'err'})})
	}
}
exports.exp = function(req , res) {
	const validating = DebtValidation.income_wallet(req.body);
	if (validating.error) {
		res.status(401).send(validating.error.details[0].message)
	} else {
		var time = new Date(req.body.time)
		var ISOTime = time.toISOString()
		const income_wallet = new Income_wallet({
			_id: new mongoose.Types.ObjectId(),
			description: req.body.description,
			IQ_amount : req.body.IQ_amount,
			Dollar_amount : req.body.Dollar_amount,
			operation:-1,
			inc_exp:true,
			uptime: ISOTime,
			time: req.body.time,
			user_id:req.checklogin._id
		})
		var IQ_wallet = parseInt(req.checklogin.IQ_wallet) - parseInt(req.body.IQ_amount)
		var Dollars_wallet = parseInt(req.checklogin.Dollars_wallet) - parseInt(req.body.Dollar_amount)
		income_wallet.save().then(result=>{

			User.updateOne({_id:req.checklogin._id}, {
				$set: {
				"IQ_wallet": IQ_wallet,
				"Dollars_wallet": Dollars_wallet,
				}}, {
				new: true}).then(result => {}).catch(err => {res.status(400).send({msg:'err'})});
			res.status(200).send({msg:'expenses added'})
		}).catch(err=>{})
	}
}
exports.get_exp = function (req , res) {
	Income_wallet.find({operation:-1 ,inc_exp:true , user_id:req.checklogin._id})
	.select('description  IQ_amount  Dollar_amount time')
	.then(result =>{
		res.status(200).send({exp : result})
	})
	.catch(err =>{
		res.status(400).send({msg:'err'})
	})
}
exports.get_inc = function (req , res) {
	Income_wallet.find({operation:1 ,inc_exp:true , user_id:req.checklogin._id})
	.select('description  IQ_amount  Dollar_amount time')
	.then(result =>{
		res.status(200).send({inc : result})
	})
	.catch(err =>{
		res.status(400).send({msg:'err'})
	})
}

