const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  client_name: {
    type: String,
    required: [true, 'client_name Is Required'],
  },
  user_id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
  client_city: {
    type: String,
    required: [true, 'client_city Is Required'],
  },
  total_price: {
    type: Number,
    required: [true, 'total_price Is Required'],
  },
  cash_received_inIQ:{
	  type: Number,
    required: [true, 'cash_received_inIQ Is Required'],
  },
  cash_received_inDollar:{
    type: Number,
    required: [true, 'cash_received_inDollar Is Required'],
  },
  Sequence: {
    type: Number,
    required: [true, 'Sequence Is Required'],
  },
  exchange: {
    type: Number,
    required: [true, 'exchange Is Required'],
  },
  uptime: {
    type: String,
  },
});
let List = mongoose.model('List', listSchema);

///////////////////////////////////////////////////////////////////

const clientSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  client_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Client',
		required: true
  },
  user_id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
  exchange: {
    type: Number,
    required: [true, 'exchange Is Required'],
  },
  client_city: {
    type: String,
    required: [true, 'client_city Is Required'],
  },
  total_price: {
    type: Number,
    required: [true, 'total_price Is Required'],
  },
  cash_received_inIQ:{
	  type: Number,
    required: [true, 'cash_received_inIQ Is Required'],
  },
  cash_received_inDollar:{
    type: Number,
    required: [true, 'cash_received_inDollar Is Required'],
  },
  // later_cash_inIQ :{
	//   type: Number,
  //   required: [true, 'later_cash_inIQ Is Required'],k
  // },
  later_cash_Dollar :{
	  type: Number,
    required: [true, 'later_cash_Dollar Is Required'],
  },
  Sequence: {
    type: Number,
    required: [true, 'Sequence Is Required'],
  },
  uptime: {
    type: String,
  },
});
let Client_List = mongoose.model('Client_List', clientSchema);

///////////////////////////////////////////////////////////////////////

const list_F_Schema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  client_name: {
    type: String,
    required: [true, 'client_name Is Required'],
  },
  user_id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
  // exchange: {
  //   type: Number,
  //   required: [true, 'exchange Is Required'],
  // },
  client_city: {
    type: String,
    required: [true, 'client_city Is Required'],
  },
  phone: {
    type: String,
    required: [true, 'phone Is Required'],
  },
  delivery_customer: {
    type: Number,
    required: [true, 'delivery_customer Is Required'],
  },
  delivery_shop: {
    type: Number,
    required: [true, 'delivery_shop Is Required'],
  },
  total_price: {
    type: Number,
    required: [true, 'total_price Is Required'],
  },
  done: {
    type: Boolean,
    required: [true, 'done Is Required'],
  },
  Sequence: {
    type: Number,
    required: [true, 'Sequence Is Required'],
  },
  uptime: {
    type: String,
  },
});
let List_facebook = mongoose.model('List_facebook', list_F_Schema);

module.exports = { List ,Client_List ,List_facebook};
