const mongoose = require('mongoose');


const itemsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	list_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'List',
		required: true
	},
	description: {
		type: String,
		required: [true, 'description Is Required'],
	},
	numberOfPices: {
		type: Number,
		required: [true, 'numberOfPices Is Required'],
	},
	price_for_one: {
		type: Number,
		required: [true, 'price_for_one Is Required'],
	},
	user_id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	uptime: {
		type: String,
	  },

})
let Items = mongoose.model('Items', itemsSchema);


/////////////////////////////////////////////
const client_itemsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	Client_list: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Client_list',
		required: true
	},
	user_id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	description: {
		type: String,
		required: [true, 'description Is Required'],
	},
	numberOfPices: {
		type: Number,
		required: [true, 'numberOfPices Is Required'],
	},
	price_for_one: {
		type: Number,
		required: [true, 'price_for_one Is Required'],
	},
	uptime: {
		type: String,
	  },
})
let Client_Items = mongoose.model('Client_Items', client_itemsSchema);




//////////////////////////////////////////////
const FB_itemsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	facebook_List_ID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'List_facebook',
		required: true
	},
	user_id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	description: {
		type: String,
		required: [true, 'description Is Required'],
	},
	numberOfPices: {
		type: Number,
		required: [true, 'numberOfPices Is Required'],
	},
	price_for_one: {
		type: Number,
		required: [true, 'price_for_one Is Required'],
	},
	uptime: {
		type: String,
	  },
})
let FB_Items = mongoose.model('FB_Items', FB_itemsSchema);


module.exports = { Items ,Client_Items , FB_Items};
