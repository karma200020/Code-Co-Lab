var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const{check, validationResult} = require('express-validator');
const user = require('../models/user.js');


router.post('/',[ 
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a proper email').isEmail(), //email format
    check('password', 'Please enter a password with 5 or more charectors').isLength({min: 5})
], async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    const {name, email, password} = req.body;

    try{
        var User = new user({
            name,
            email,  
            password
        });

        const salt = await bcrypt.genSalt(10);
        User.password = await bcrypt.hash(password, salt);
        await User.save();

    const payload = {
        User: {
            id: User.id,
        }
    }
    res.status(200).send({"userid":payload.User.id});

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});

module.exports = router;