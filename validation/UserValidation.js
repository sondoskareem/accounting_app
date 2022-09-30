
const Joi = require('joi');


exports.new_user=function (User) {
    const UserSchema = {
        'name': Joi.string().required(),
        'password': Joi.string().min(4).required(),
        'email': Joi.string().email().required(),
    }
    return Joi.validate(User, UserSchema);
}

exports.new_client=function (Client) {
    const Clientchema = {
        'name': Joi.string().required(),
        'city': Joi.string().required(),
        'phone': Joi.number().min(6).required(),
    }
    return Joi.validate(Client, Clientchema);
}
