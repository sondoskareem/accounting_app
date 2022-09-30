'use strict';

module.exports = function(path,app) {
	var UsersMW = require('../mw/check_user');
	var checkLogin_admin = require('../mw/check_login');


	/////////////////////////////// User Routes
	var User = require('../controller/UserController');
	app.route(`${path}/auth/register`).post(User.create_a_User);
	app.route(`${path}/auth/login`).post(User.loginUser);
	app.route(`${path}/auth/check/login`).post(checkLogin_admin.checkLogin_admin, User.check_login);
	app.route(`${path}/auth/conform/email`).post(User.confirm_email);
	app.route(`${path}/auth/resend/code`).post(User.resend_code);
	app.route(`${path}/auth/update/password`).post(UsersMW.checklogin,User.update_password);
	app.route(`${path}/auth/wallet`).get(UsersMW.checklogin, User.wallet_info);
	
	///////////////////////////////////// add client
	app.route(`${path}/add/client`).post(UsersMW.checklogin,  User.create_client);

	//////////////////////////////// Debt Routes
	var Debt = require('../controller/debtController');
	// app.route(`${path}/debt/add`).post(UsersMW.checklogin,Debt.add_debt);
	app.route(`${path}/debt/subtract`).post(UsersMW.checklogin, Debt.subtract_debt);
	app.route(`${path}/debt/unpaid`).get(UsersMW.checklogin,  Debt.UN_paid_dept)
	app.route(`${path}/debt/fb/mony/recieved`).post(UsersMW.checklogin,  Debt.fb_mony_recieved);

	////////////////////////////////////list+Items router
	var Lsit = require('../controller/listController');
	app.route(`${path}/list/add`).post(UsersMW.checklogin ,Lsit.add_list);
	app.route(`${path}/list/f/add`).post(UsersMW.checklogin, Lsit.add_facebook_list);
	app.route(`${path}/list/client/add`).post(UsersMW.checklogin,  Lsit.add_Client_List);
	app.route(`${path}/list/exp/time/zone`).post(UsersMW.checklogin,  Lsit.wallet_report_exp);
	app.route(`${path}/list/inc/time/zone`).post(UsersMW.checklogin,  Lsit.wallet_report_inc);
	app.route(`${path}/list/facebook`).get(UsersMW.checklogin,  Lsit.faceBook_list);
	app.route(`${path}/list/customer`).get(UsersMW.checklogin, Lsit.customer_list);
	app.route(`${path}/list/client`).get(UsersMW.checklogin, Lsit.client_list);
	app.route(`${path}/info/client`).get(UsersMW.checklogin,  Lsit.view_client);
	app.route(`${path}/info`).get(UsersMW.checklogin, Lsit.user_info);
	app.route(`${path}/list/client/info`).get(UsersMW.checklogin,  Lsit.view_client_list);
	app.route(`${path}/list/customer/info`).get(UsersMW.checklogin,  Lsit.view_customer_list);
	app.route(`${path}/list/fb/info`).get(UsersMW.checklogin,  Lsit.view_facebook_list);
	app.route(`${path}/list/fb/undone/info`).get(UsersMW.checklogin,  Lsit.view_unDone_facebook_list);

///////////////////////////////////inc_exp
	var exp_inc = require('../controller/income_exp_controller');
	app.route(`${path}/wallet/inc`).post(UsersMW.checklogin , exp_inc.inc);
	app.route(`${path}/wallet/exp`).post(UsersMW.checklogin ,exp_inc.exp);
	app.route(`${path}/wallet/exp`).get(UsersMW.checklogin ,exp_inc.get_exp);
	app.route(`${path}/wallet/inc`).get(UsersMW.checklogin ,exp_inc.get_inc);


}
