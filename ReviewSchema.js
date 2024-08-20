const joi = require('joi');

module.exports.reviewSchema = joi.object({
    listing : joi.object({
        rating : joi.number().required(),
        Comment : joi.string().required(),
    }).required()
});