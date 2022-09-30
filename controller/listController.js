'use strict';
// const Joi = require('joi');
const mongoose = require('mongoose');
var moment = require('moment');
var ListValidation = require('../validation/ListValidation');
const bcrypt = require('bcrypt');
const isodate = require('isodate')
// const joi = require('joi');
// const jwt = require('jsonwebtoken');
let { Items, Client_Items, FB_Items } = require('../models/item');
let { List, Client_List, List_facebook } = require('../models/list')
let { User, Income_wallet, Client, Client_debt } = require('../models/users')

exports.add_list = function (req, res) {
	const validating = ListValidation.List(req.body);
	if (validating.error) {
		res.status(401).send(validating.error.details[0].message)
	} else {
		var data = []
		const list = new List({
			_id: new mongoose.Types.ObjectId(),
			client_name: req.body.client_name,
			client_city: req.body.client_city,
			total_price: req.body.total_price,
			cash_received_inIQ: req.body.cash_received_inIQ,
			cash_received_inDollar: req.body.cash_received_inDollar,
			Sequence: req.body.Sequence,
			exchange: req.body.exchange,
			uptime: req.body.uptime,
			user_id:req.checklogin._id
			// uptime: '09/09/2019'
		});
		if(!Array.isArray(req.body.description)){
			let obj = {
				_id: new mongoose.Types.ObjectId(),
				list_id: list._id,
				description:  req.body.description,
				numberOfPices:  req.body.numberOfPices,
				price_for_one:  req.body.price_for_one,
				uptime: req.body.uptime,
				user_id:req.checklogin._id
			}
			Items.insertMany(obj)
			.then(result00 => {
				// console.log('items added')
			})
			.catch(err => {
				console.log('err')
			})

		}else if(Array.isArray(req.body.description)){
			for (var i = 0; i < req.body.description.length; i++) {
			let obj = {
				_id: new mongoose.Types.ObjectId(),
				list_id: list._id,
				description: req.body.description[i],
				numberOfPices: req.body.numberOfPices[i],
				price_for_one: req.body.price_for_one[i],
				uptime: req.body.uptime,
				user_id:req.checklogin._id
			}
			data.push(obj)
		}

		Items.insertMany(data)
			.then(result00 => {
				// console.log('items added')
			})
			.catch(err => {
				console.log('err')
			})
		}

		var time = new Date(req.body.uptime)
		var ISOTime = time.toISOString()
			// console.log(ISOTime)
		const income_wallet = new Income_wallet({
			_id: new mongoose.Types.ObjectId(),
			description: 'قطع وصل للزبون',
			IQ_amount: req.body.cash_received_inIQ,
			Dollar_amount: req.body.cash_received_inDollar,
			operation: 1,
			uptime: ISOTime,
			inc_exp:false,
			time: req.body.uptime,
			user_id:req.checklogin._id
		})
		income_wallet.save().then(result => { }).catch(err => { })

		list.save()
			.then(result => {
				var IQ_T = parseInt(req.checklogin.IQ_wallet) + parseInt(result.cash_received_inIQ)
				var IQ = IQ_T - parseInt(req.body.exchange)
				var dollar = parseInt(req.checklogin.Dollars_wallet) + parseInt(result.cash_received_inDollar)
				if (req.body.exchange != 0) {
					const income_wallet_ = new Income_wallet({
						_id: new mongoose.Types.ObjectId(),
						description: ' تصريف لزبون  ',
						IQ_amount: req.body.exchange,
						Dollar_amount: 0,
						operation: -1,
						inc_exp:false,
						uptime: ISOTime,
						time:req.body.uptime,
						user_id:req.checklogin._id
					})
					income_wallet_.save()
						.then(result => { })
						.catch(err => { })
				}
				User.updateOne({
					_id: req.checklogin._id
				}, {
					$set: {
						"IQ_wallet": IQ,
						"Dollars_wallet": dollar,
					}
				}, {
					new: true
				})
					.then(result => {
						res.status(200).send({ msg: 'تم اضافة وصل جديد' })
					})
					.catch(err => {
						res.status(400).send({ msg: 'err' })
					});
			})
			.catch(err => {
				res.status(400).send({ msg: 'err' })
			})
	}
}

exports.add_facebook_list = function (req, res) {
	const validating = ListValidation.FaceBook_List(req.body);
	if (validating.error) {
		res.status(401).send(validating.error.details[0].message)
	} else {
		// console.log('............................................///////////////////...........')

		var time = new Date(req.body.uptime)
		var ISOTime = time.toISOString()
		var data = []
		const list_facebook = new List_facebook({
			_id: new mongoose.Types.ObjectId(),
			client_name: req.body.client_name,
			phone: req.body.phone,
			client_city: req.body.client_city,
			total_price: req.body.total_price,
			delivery_customer: req.body.delivery_customer,
			delivery_shop: req.body.delivery_shop,
			done: false,
			Sequence: req.body.Sequence,
			uptime: req.body.uptime,
			user_id:req.checklogin._id
		});

		
		if(!Array.isArray(req.body.description)){
			let obj = {
				_id: new mongoose.Types.ObjectId(),
				facebook_List_ID: list_facebook._id,
				description: req.body.description,
				numberOfPices: req.body.numberOfPices,
				price_for_one: req.body.price_for_one,
				uptime: req.body.uptime,
				user_id:req.checklogin._id
			}

			FB_Items.insertMany(obj)
				.then(result00 => {
				})
				.catch(err => {
					console.log('err')
				})
			
		}else if(Array.isArray(req.body.description)){
			for (var i = 0; i < req.body.description.length; i++) {
				let obj = {
					_id: new mongoose.Types.ObjectId(),
					facebook_List_ID: list_facebook._id,
					description: req.body.description[i],
					numberOfPices: req.body.numberOfPices[i],
					price_for_one: req.body.price_for_one[i],
					uptime: req.body.uptime,
					user_id:req.checklogin._id
				}
				// console.log(obj)
				data.push(obj)
			}
			FB_Items.insertMany(data)
				.then(result00 => {
				})
				.catch(err => {
					console.log('err')
				})
		}


		if (req.body.delivery_shop != 0) {
			var iq = parseInt(req.checklogin.IQ_wallet) - parseInt(req.body.delivery_shop)
			const income_wallet = new Income_wallet({
				_id: new mongoose.Types.ObjectId(),
				description: 'قطع مبلغ التوصيل للطلبات عن طريق الفيسبوك',
				IQ_amount: req.body.delivery_shop,
				Dollar_amount: 0,
				operation: -1,
				inc_exp:false,
				uptime: ISOTime,
				time:req.body.uptime,
				user_id:req.checklogin._id
			})
			income_wallet.save().then(result => { }).catch(err => { })
			
			User.updateOne({ _id: req.checklogin._id }, {
				$set: {
					"IQ_wallet": iq,
				}
			}, {
				new: true
			}).then(result => {
			}).catch(err => { res.status(400).send({ msg: 'err' }) });
		}
		// else if(req.body.delivery_customer !=0){

		// }
		list_facebook.save()
			.then(result => {
				res.status(200).send({ msg: 'تم اضافة وصل جديد' })
			})
			.catch(err => {
			})
	}
}

exports.add_Client_List = function (req, res) {
	const validating = ListValidation.Client_list(req.body);
	if (validating.error) {
		res.status(401).send(validating.error.details[0].message)
	} else {
		var time = new Date(req.body.uptime)
		var ISOTime = time.toISOString()
		var data = []
		const client_List = new Client_List({
			_id: new mongoose.Types.ObjectId(),
			client_id: req.body.client_id,
			client_city: req.body.client_city,
			total_price: req.body.total_price,
			cash_received_inIQ: req.body.cash_received_inIQ,
			cash_received_inDollar: req.body.cash_received_inDollar,
			exchange: req.body.exchange,
			later_cash_Dollar: req.body.later_cash_Dollar,
			Sequence: req.body.Sequence,
			// uptime: moment().format('DD/MM/YYYY')08/09/2019
			uptime: req.body.uptime,
			user_id:req.checklogin._id
		});

		if(!Array.isArray(req.body.description)){
			let obj = {
				_id: new mongoose.Types.ObjectId(),
				Client_list: client_List._id,
				description: req.body.description,
				numberOfPices: req.body.numberOfPices,
				price_for_one: req.body.price_for_one,
				uptime:req.body.uptime,
				user_id:req.checklogin._id
			}

			Client_Items.insertMany(obj)
				.then(result00 => {
				})
				.catch(err => {
					console.log('err')
				})
			
		}else if(Array.isArray(req.body.description)){
			for (var i = 0; i < req.body.description.length; i++) {
				let obj = {
					_id: new mongoose.Types.ObjectId(),
					Client_list: client_List._id,
					description: req.body.description[i],
					numberOfPices: req.body.numberOfPices[i],
					price_for_one: req.body.price_for_one[i],
					uptime:req.body.uptime,
					user_id:req.checklogin._id
				}
				data.push(obj)
			}
			Client_Items.insertMany(data)
				.then(result00 => {
				})
				.catch(err => {
				})
		}




		const income_wallet = new Income_wallet({
			_id: new mongoose.Types.ObjectId(),
			description: 'قطع وصل للعميل',
			IQ_amount: req.body.cash_received_inIQ,
			Dollar_amount: req.body.cash_received_inDollar,
			operation: 1,
			inc_exp:false,
			uptime: ISOTime,
			time : req.body.uptime,
			user_id:req.checklogin._id
		})
		income_wallet.save().then(result => { }).catch(err => { })

		client_List.save()
			.then(result => {

				var IQ_T = parseInt(req.checklogin.IQ_wallet) + parseInt(result.cash_received_inIQ)
				var IQ = IQ_T - parseInt(result.exchange)
				var dollar = parseInt(req.checklogin.Dollars_wallet) + parseInt(result.cash_received_inDollar)

				if (result.exchange != 0) {
					const income_wallet = new Income_wallet({
						_id: new mongoose.Types.ObjectId(),
						description: 'سحب مبلغ للتصريف',
						IQ_amount: result.exchange,
						Dollar_amount: 0,
						operation: -1,
						inc_exp:false,
						uptime: ISOTime,
						time : req.body.uptime,
						user_id:req.checklogin._id
					})
					income_wallet.save().then(result => { }).catch(err => { })
				}

				User.updateOne({ _id: req.checklogin._id }, {
					$set: {
						"IQ_wallet": IQ,
						"Dollars_wallet": dollar,
					}
				}, {
					new: true
				}).then(result => { }).catch(err => { res.status(400).send({ msg: 'err' }) });

				if (req.body.later_cash_Dollar != 0) {

					Client_debt.find({ client_id: req.body.client_id , user_id:req.checklogin._id})
						.then(result01 => {

							var client_debt_Dollar = parseInt(result01[0].Dollars_amount_left) + parseInt(req.body.later_cash_Dollar)

							Client_debt.updateOne({ client_id: req.body.client_id , user_id:req.checklogin._id }, {
								$set: {
									"Dollars_amount_left": client_debt_Dollar,
								}
							}, {
								new: true
							}).then(result => {
								res.status(200).send({ msg: 'تم قطع وصل للعميل' })
							}).catch(err => { res.status(400).send({ msg: 'err' }) });

						})
						.catch(err => {
							res.status(400).send({ msg: 'err' })
						})

					//////////////////////no debt
				} else if (req.body.later_cash_Dollar == 0) {
					res.status(200).send({ msg: 'تم قطع وصل للعميل' })
				}

			})
			.catch(err => {
				res.status(400).send({ msg: err })
			})
	}
}


///
exports.wallet_report_exp = function (req, res) {
	var first_time = new Date(req.body.from)
	var first_time__ = first_time.toISOString()
	// console.log(first_time__ + ' oo')
	var user_id = mongoose.Types.ObjectId(req.checklogin._id);

	var second_time = new Date(req.body.to)
	var second_time__ = second_time.toISOString()
	// console.log(second_time__ + '   tt')

	Income_wallet.aggregate([
		{
		$match: { $and: [{ operation: -1 },{user_id:user_id}, { uptime: { $gte: first_time__, $lte: second_time__ } }] }
	},
	{
		$group: {
			_id: 'null',
			total_IQ: { $sum: "$IQ_amount" },
			total_Dollar: { $sum: "$Dollar_amount" },
			info:{$push : "$$ROOT"}
		}
	},
	// {
	// 	$project:{
	// 		'description':1,
	// 		'IQ_amount':1,
	// 		'Dollar_amount':1,
	// 		'time':1,
	// 	}
	// }
	], function (err, results) {
		if (err) {
			//handle error
			console.log(err)
		} else {
		
			res.status(200).send({ exp: results })
		}
	});

}
exports.wallet_report_inc = function (req, res) {
	var first_time = new Date(req.body.from)
	var first_time__ = first_time.toISOString()
	var user_id = mongoose.Types.ObjectId(req.checklogin._id);

	var second_time = new Date(req.body.to)
	var second_time__ = second_time.toISOString()

	Income_wallet.aggregate([{
		$match: { $and: [{ operation: 1 },{user_id:user_id}, { uptime: { $gte: first_time__, $lte: second_time__ } }] }
		// $match : { $and : [  {operation: -1} , {uptime :  "12/09/2019"} ] }
	},
	{
		$group: {
			_id: 'null',
			total_IQ: { $sum: "$IQ_amount" },
			total_Dollar: { $sum: "$Dollar_amount" },
			info:{$push : "$$ROOT"}
		}
	},
	// {
	// 	$project:{
	// 		'description':1,
	// 		'IQ_amount':1,
	// 		'Dollar_amount':1,
	// 		'time':1,
	// 	}
	// }
	], function (err, results) {
		if (err) {
			//handle error
			console.log('err')
		} else {
		
			res.status(200).send({ inc: results })
		}
	});

}

////////////////////////// get list
exports.faceBook_list = function (req, res) {
	List_facebook.find({user_id:req.checklogin._id})
		.select('client_name total_price uptime ')
		.then(result => {
			res.status(200).send({ facebook_list: result })
		})
		.catch(err => {
			res.status(400).send({ msg: 'err' })
		})
}
exports.customer_list = function (req, res) {
	List.find({user_id:req.checklogin._id})
		.select('client_name   total_price   uptime ')
		.then(result => {
			res.status(200).send({ customer_list: result })
		})
		.catch(err => {
			res.status(400).send({ msg: 'err' })
		})
}
exports.client_list = function (req, res) {
	Client_List.find({user_id:req.checklogin._id})
		.populate('client_id', 'name')
		.select(' total_price  client_name uptime ')
		.then(result => {
			
			res.status(200).send({ client_list: result })
		})
		.catch(err => {
			res.status(400).send({ msg: 'err' })
		})
}

//// get wallet info
exports.user_info = function (req, res) {
	var data = []
	User.find({user_id:req.checklogin._id})
		.select('IQ_wallet  Dollars_wallet')
		.then(result => {
			res.status(200).send({ info: result })
		})
		.catch(err => {
			res.status(400).send({ msg: 'err' })
		})
}


exports.view_client = function (req, res) {
	var user_id = mongoose.Types.ObjectId(req.checklogin._id);
	
	Client.aggregate([
		{
			$match: { $and: [{user_id:user_id}] }
		},
		{
		$lookup: {
			from: 'client_debts',
			localField: '_id',
			foreignField: 'client_id',
			as: 'client_debts',
		},
	},
	{
		$project: {
			"_id": 1,
			"name": 1,
			"phone": 1,
			"city": 1,
			"client_debts": { Dollars_amount_left: 1 },

		}
	}
		//   {
		//     $lookup: {
		//       from: 'trainings',
		//       localField: '_id',
		//       foreignField: 'user_id',
		//       as: 'trainings',
		//     },
		//   },
	]).then((users) => {
		res.status(200).send({ client: users })
	}).catch((err) => {
		res.status(400).send(err)
	})

}

exports.view_customer_list = function (req, res) {
	var id = mongoose.Types.ObjectId(req.query.id);
	var user_id = mongoose.Types.ObjectId(req.checklogin._id);
	List.aggregate([
		
		{$match: { $and: [{ _id :id ,user_id:user_id  }]} },
		{
		$lookup: {
			from: 'items',
			localField: '_id',
			foreignField: 'list_id',
			as: 'items',
		},
	},
	{
		$project: {
			"_id": 1,
			"client_city": 1,
			"client_name": 1,
			"total_price": 1,
			"cash_received_inIQ": 1,
			"cash_received_inDollar": 1,
			"exchange": 1,
			"later_cash_Dollar": 1,
			"Sequence": 1,
			"uptime": 1,
			"items": { "description": 1, "numberOfPices": 1, "price_for_one": 1 },
		}
	}

	]).then((users) => {
		res.status(200).send({ customer_list_info: users })
	}).catch((err) => {
		res.status(400).send(err)
	})

}
exports.view_facebook_list = function (req, res) {
	var id = mongoose.Types.ObjectId(req.query.id);
	var user_id = mongoose.Types.ObjectId(req.checklogin._id);

	List_facebook.aggregate([
		
		{$match: { $and: [{ _id :id} , {user_id:user_id} , {done: true}] } },
		{
		$lookup: {
			from: 'fb_items',
			localField: '_id',
			foreignField: 'facebook_List_ID',
			as: 'items',
		},
	},
	{
		$project: {
			"_id": 1,
			"client_city": 1,
			"client_name": 1,
			"total_price": 1,
			"phone": 1,
			"cash_received_inIQ": 1,
			"cash_received_inDollar": 1,
			"exchange": 1,
			"later_cash_Dollar": 1,
			"Sequence": 1,
			"uptime": 1,
			"items": { "description": 1, "numberOfPices": 1, "price_for_one": 1 },
		}
	}

	]).then((users) => {
		res.status(200).send({ fb_list_info: users })
	}).catch((err) => {
		res.status(400).send(err)
	})

}

exports.view_client_list = function (req, res) {
	var id = mongoose.Types.ObjectId(req.query.id);
	var user_id = mongoose.Types.ObjectId(req.checklogin._id);

	Client_List.aggregate([
	{$match: { $and: [{ _id :id} , {user_id:user_id}]} },
		{
		$lookup: {
			from: 'client_items',
			localField: '_id',
			foreignField: 'Client_list',
			as: 'client_items',
		},
	},
	{
		$project: {
			"_id": 1,
			"client_city": 1,
			"client_id": 1,
			"total_price": 1,
			"cash_received_inIQ": 1,
			"cash_received_inDollar": 1,
			"exchange": 1,
			"later_cash_Dollar": 1,
			"Sequence": 1,
			"uptime": 1,
			"client_items": { "description": 1, "numberOfPices": 1, "price_for_one": 1 },
		}
	}

	]).then((users) => {
		Client.populate(users, {
			path: 'client_id',
			select: 'name'
		}, (err, resulttt) => {
			res.status(200).send({ client_List_Info: resulttt })
		})
		// res.send({user:users})
	}).catch((err) => {
		res.status(400).send(err)
	})
}

exports.view_unDone_facebook_list = function (req, res) {
	// var id = mongoose.Types.ObjectId(req.query.id);
	var user_id = mongoose.Types.ObjectId(req.checklogin._id);

	List_facebook.aggregate([
		
		{$match: { $and: [ {done: false} , {user_id : user_id}] } },
		{
		$lookup: {
			from: 'fb_items',
			localField: '_id',
			foreignField: 'facebook_List_ID',
			as: 'items',
		},
	},
	{
		$project: {
			"_id": 1,
			"client_city": 1,
			"client_name": 1,
			"total_price": 1,
			"phone": 1,
			"cash_received_inIQ": 1,
			"cash_received_inDollar": 1,
			"exchange": 1,
			"later_cash_Dollar": 1,
			"Sequence": 1,
			"delivery_customer": 1,
			"uptime": 1,
			"items": { "description": 1, "numberOfPices": 1, "price_for_one": 1 },
		}
	}

	]).then((users) => {
		res.status(200).send({ fb_list_info: users })
	}).catch((err) => {
		res.status(400).send(err)
	})

}