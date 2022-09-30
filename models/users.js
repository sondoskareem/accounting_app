 

const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  name: {
    unique: true,
    type: String,
    required: [true, 'userName Is Required'],
  },
  password: {
    type: String,
    required: [true, 'password Is Required'],
  },
  email: {
    unique: true,
    type: String,
    required: [true, 'email Is Required'],
  },
  IQ_wallet: {
    type: Number,
    required: [true, 'IQ_wallet Is Required'],
  },
  Dollars_wallet: {
    type: Number,
    required: [true, 'Dollars_wallet Is Required'],
  },
  isActive:{
    type: Boolean,
    required: [true, 'isActive Is Required'],
  },
  uptime: {
    type: String,
  },
});
let User = mongoose.model('User', userSchema);
////////////////////////////////////////////////////////////////

const IncomeSchema = mongoose.Schema({
	
	_id: mongoose.Schema.Types.ObjectId,
	description: {
		type: String,
		required: [true, 'description Is Required'],
  },
  user_id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	IQ_amount: {
		type: Number,
		required: [true, 'IQ_amount Is Required'],
	},
	Dollar_amount: {
		type: Number,
		required: [true, 'numberOfPices Is Required'],
	},
	operation: {
		type: Number,
		required: [true, 'operation Is Required'],
  },
  inc_exp: {
		type: Boolean,
		required: [true, 'inc_exp Is Required'],
	},
	uptime: {
    type: String,
    required: [true, 'uptime Is Required'],
    },

  time: {
    type: String,
    required: [true, 'time Is Required'],
    },
      
}) 
let Income_wallet = mongoose.model('Income_wallet', IncomeSchema);

/////////////////////////////////////////////////
const clientSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, 'name Is Required'],
  },
  user_id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
  city: {
    type: String,
    required: [true, 'name Is Required'],
  },
  phone: {
    type: String,
    required: [true, 'phone Is Required'],
  },
  uptime: {
    type: String,
  },
});
let Client = mongoose.model('Client', clientSchema);

////////////////////////////////////////////

const debtSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  client_id: {
    unique: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Client',
		required: true
  },
  user_id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
  Dollars_amount_left: {
    type: Number,
    required: [true, 'Dollars_amount Is Required'],
  },
  
  Dollars_amount_back: {
    type: Number,
    required: [true, 'Dollars_amount_back Is Required'],
  },
  uptime: {
    type: String,
  },
});
let Client_debt = mongoose.model('Client_debt', debtSchema);

module.exports = { Income_wallet, User ,Client ,Client_debt   };