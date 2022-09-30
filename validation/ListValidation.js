
const Joi = require('joi');


exports.List=function (List) {
    const ListSchema = {
        'client_name': Joi.string().required(),
        'client_city': Joi.string().required(),
        'total_price': Joi.number().required(),
        'cash_received_inIQ': Joi.number().required(),
        'cash_received_inDollar': Joi.number().required(),
        'Sequence': Joi.string().required(),
        'description': Joi.empty(),
        'numberOfPices': Joi.empty(),
        'price_for_one': Joi.empty(),
        'exchange': Joi.number().required(),
        'uptime' :Joi.string().required(),
    }
    return Joi.validate(List, ListSchema);
}

exports.FaceBook_List=function (List) {
    const ListSchema = {
        'phone': Joi.number().required(),
        'delivery_customer': Joi.empty(),
        'delivery_shop': Joi.number().required(),
        'client_name': Joi.string().required(),
        'client_city': Joi.string().required(),
        'total_price': Joi.number().required(),
        'Sequence': Joi.empty(),
        'description': Joi.empty(),
        'numberOfPices': Joi.empty(),
        'price_for_one': Joi.empty(),
        'uptime' :Joi.string().required(),
    }
    return Joi.validate(List, ListSchema);
}

exports.Client_list=function (List) {
    const ListSchema = {
        'client_id': Joi.string().required(),
        'client_city': Joi.string().required(),
        'total_price': Joi.number().required(),
        'cash_received_inIQ': Joi.number().required(),
        'cash_received_inDollar': Joi.number().required(),
        // 'later_cash_inIQ': Joi.number().required(),
        'later_cash_Dollar': Joi.empty(),
        'Sequence': Joi.string().required(),
        'description': Joi.empty(),
        'numberOfPices': Joi.empty(),
        'price_for_one': Joi.empty(),
        'exchange': Joi.number().required(),
        'uptime' :Joi.string().required(),
    }
    return Joi.validate(List, ListSchema);
}