const mongoose = require('mongoose');
var moment = require('moment');
var DebtValidation = require('../validation/DebtValidation');
let {User, Income_wallet , Client ,Client_debt } = require('../models/users')
let {List, Client_List , List_facebook} = require('../models/list')

////////////////////////////////////////////////////////////// subtract_debt

exports.subtract_debt = function(req , res){
	
		Client_debt.find({client_id : req.body.client_id , user_id:req.checklogin._id})
		.then(result =>{
			// console.log('  D  ' +result[0].Dollars_amount_left+' IQ  ' + result[0].IQ_amount_left )
		if(result[0].Dollars_amount_left >= req.body.Total_amount ){
			var  Dollars_amount_left = parseInt(result[0].Dollars_amount_left) - parseInt(req.body.Total_amount)
			
			var  Dollars_amount_back = parseInt(result[0].Dollars_amount_back) + parseInt(req.body.Total_amount)

			var Dollar_wallet = parseInt(req.checklogin.Dollars_wallet) +  parseInt(req.body.Dollars_amount)
			var IQ_wallet_ = parseInt(req.checklogin.IQ_wallet) +  parseInt(req.body.IQ_amount)
			var IQ_wallet = IQ_wallet_ - parseInt( req.body.exchange)

			var time = new Date(req.body.uptime)
			var ISOTime = time.toISOString()

			if( req.body.exchange != 0 ){
				const income_wallet = new Income_wallet({
				_id: new mongoose.Types.ObjectId(),
				description: 'سحب مبلغ التصريف',
				IQ_amount : req.body.exchange,
				Dollar_amount :  0,
				operation: -1,
				inc_exp:false,
				uptime:  ISOTime,
				time : req.body.uptime,
				user_id:req.checklogin._id
			})
			income_wallet.save().then(result=>{}).catch(err=>{})
			}

			const income_wallet = new Income_wallet({
				_id: new mongoose.Types.ObjectId(),
				description:' دفع مبلغ آجل من قبل العميل ',
				IQ_amount :IQ_wallet_ ,
				Dollar_amount : Dollar_wallet,
				operation: 1,
				inc_exp:false,
				uptime:  ISOTime,
				time : req.body.uptime,
				user_id:req.checklogin._id
			})
			income_wallet.save().then(result=>{}).catch(err=>{})

			Client_debt.updateOne({client_id:req.body.client_id ,  user_id:req.checklogin._id}, {
				$set: {
				"Dollars_amount_left": Dollars_amount_left,
				"Dollars_amount_back": Dollars_amount_back,
				}}, {
				new: true}).then(result => {}).catch(err => {res.status(400).send({msg:'err'})});
					
				User.updateOne({_id:req.checklogin._id}, {
					$set: {
					"IQ_wallet": IQ_wallet,
					"Dollars_wallet": Dollar_wallet,
					}}, {
					new: true}).then(result => {res.status(200).send({msg:'تم اضافة المبلغ للقاصة'})}).catch(err => {res.status(400).send({msg:'err'})});

			}else{
				res.status(200).send({msg:'تأكد من الرقم المدخل '})
			}

		})
		.catch(err =>{
			res.status(400).send({msg:'err'})
		})
	// }
}

exports.UN_paid_dept = function(req , res) {
	var data =[]
	Client_debt.find({user_id:req.checklogin._id})
	.populate('client_id')
	.select('client_id Dollars_amount_left IQ_amount_left  IQ_amount_back Dollars_amount_back')
	.then(result =>{
	var obj ={
		client_name : result[0].client_id.name,
		Dollars_amount_left : result[0].Dollars_amount_left,
		IQ_amount_left : result[0].IQ_amount_left,
		IQ_amount_back : result[0].IQ_amount_back,
		Dollars_amount_back : result[0].Dollars_amount_back,
	}
	data.push(obj)
	 res.status(200).send({UN_paid_debt:data})
 })
 .catch(err =>{
	 res.status(400).send({msg:'err'})
 })
}

///////////////////////// paid FB_mony
exports.fb_mony_recieved = function(req , res){
	var time = new Date(req.body.uptime)
	var ISOTime = time.toISOString()
		{
	List_facebook.updateOne({_id:req.body.id ,user_id:req.checklogin._id, done:false}, {
		$set: {
		"done": true,
		}}, {
		new: true})
		.then( result=> {
			var IQ_ = parseInt(req.checklogin.IQ_wallet) + parseInt( req.body.IQ_amount) + parseInt(req.body.delivery_customer)
			var IQ = IQ_ - parseInt(req.body.exchange)
			var Dollars_wallet = parseInt(req.checklogin.Dollars_wallet) + parseInt( req.body.Dollars_amount)
		User.updateOne({_id:req.checklogin._id}, {
			$set: {
			"IQ_wallet": IQ,
			"Dollars_wallet": Dollars_wallet,
			}}, {
			new: true})
			.then(result => { })
			.catch(err => {});
			const income_wallet = new Income_wallet({
				_id: new mongoose.Types.ObjectId(),
				description: ' تسديد مبلغ من الفيسبوك',
				IQ_amount : req.body.IQ_amount,
				Dollar_amount :  req.body.Dollars_amount,
				operation:1,
				inc_exp:false,
				uptime:  ISOTime,
				time : req.body.uptime,
				user_id:req.checklogin._id
			})
			income_wallet.save()
			.then(result11=>{})
			.catch(err=>{})
			if(req.body.exchange != 0){
			const income_wallet_ = new Income_wallet({
				_id: new mongoose.Types.ObjectId(),
				description: '  تصريف لزبون من الفيسبوك',
				IQ_amount : req.body.exchange,
				Dollar_amount : 0,
				operation: -1,
				inc_exp:false,
				uptime:  ISOTime,
				time : req.body.uptime,
				user_id:req.checklogin._id
			})
			income_wallet_.save()
			.then(result00=>{})
			.catch(err=>{})
		}
			res.status(200).send({msg:'تم تسديد المبلغ'})
		})
		.catch(err => {res.status(400).send({msg:'تأكد من المعلومات'})});

		}

}