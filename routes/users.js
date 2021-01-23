import express from 'express';
import joi from 'joi';
const router = express.Router();



const home = 
    {
        "message": "My Rule-Validation API",
        "status": "success",
        "data": {
        "name": "Uzoma Kenkwo",
        "github": "@iamlasbrey",
        "email": "iamlasbrey@gmail.com",
        "mobile": "07061996570",
        "twitter": "@iamlasbrey"
        }
    }


router.get('/',(req,res)=>{
    res.send(home)
})

router.post('/validate-rule',(req,res) => {
    return main(req, res);
})


function evaluate_condition(field_value, condition_value, condition) {
    let result = false;

    if(condition === 'gt'){ // greater than
    result = field_value > condition_value;
    }

    if(condition === 'gte'){ // greater or equal
    result = field_value >= condition_value;
    }
    if(condition === 'eq'){ // equal
    result = field_value === condition_value;
    }
    if(condition === 'neq'){ // not equal to
    result = field_value !== condition_value;
    }

    if(condition === 'contains' && (typeof field_value === 'string' || Array.isArray(field_value))) {
    result = field_value.includes(condition_value);
    }

    return {
    field_value,
    condition,
    condition_value,
    error: !result,
    }
}




function fetch_field_value(rule_field, data) {
    const field_value = data[rule_field];
    if (!field_value){
    throw new Error(`field ${rule_field} is missing from data.`);
    }
    return field_value;
}

function rule_engine(rule, data) {
    const field_value = fetch_field_value(rule.field, data);
    const rule_result = evaluate_condition(field_value, rule.condition_value, rule.condition);
    return rule_result;
}




const schema = joi.object({
    rule : joi.object({
        field: joi.string().required(),
        condition: joi.string().required(),
        condition_value: joi.any().required()
        }).required(),

    data: joi.object().required(),
    });



function main(req, res) {
    try {
    const { error, value } = schema.validate(req.body);
    if(error) {
        throw new Error(error.message);
    }
    const rule = value.rule;
    const data = value.data;
    let message = '';
    let status = '';
    // if there is an error

    const y = rule.field.split('.');h
    let result;
    //validate
    if (y.length > 2) {
        throw new Error('Field cannot be more than 2 levels');
    }

    if (y.length === 1) {
        result = rule_engine(rule, data);
    } else {
        const parent = y[0];
        const field_name = y[1];
        if (!data[parent] && typeof data[parent] !== 'object') {
        throw new Error(`[${parent}] should be a|an [object].`)
        }
        rule.field = field_name;
        const data2 = {
        ...data,
        [field_name]: data[parent][field_name],
        }
        console.log({ x: data2})
        result = rule_engine(rule, data2)
    }


    if (result.error === true) {
        message = `field ${rule.field} failed validation.`;
        status = 'error';
    } else {
        message = `field ${rule.field} successfully validated.`;
        status = 'success';
    }

    res.status(200).json({
        message,
        status,
        data: {
        validation: result,
        }
    });

    } catch (error) {
        res.status(400).json({
        message: error.message,
        status: 'error',
        data: null
        });
    }
}







export default router;
