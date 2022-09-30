
const Joi = require('joi');


exports.client_debt=function (Debt) {
    const DebtSchema = {
        'client_id': Joi.string().required(),
        'Dollars_amount_left': Joi.number().required(),
        'IQ_amount_left': Joi.number().required(),
        'IQ_amount_back': Joi.number().required(),
        'Dollars_amount_back': Joi.number().required(),
    }
    return Joi.validate(Debt, DebtSchema);
}

exports.income_wallet=function (mony) {
    const incomeSchema = {
        'description': Joi.string().required(),
        'IQ_amount': Joi.number().required(),
        'Dollar_amount': Joi.number().required(),
        'time':  Joi.string().required(),
    }
    return Joi.validate(mony, incomeSchema);
}