var express = require('express');
var router = express.Router();
const user = require('../models/user');
const {check, validationResult} = require('express-validator/check'); 
const bcrypt = require('bcryptjs');


router.post('/',[ 
    check('email', 'Please include a proper email').isEmail(), 
    check('password', 'Password is required').exists()
], async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return(res.status(400).json({errors: errors.array() }));
    }


    const {email, password} = req.body;

    try{
        
        let User = await user.findOne({email});

        if(!User){
            return res.status(400).json({ errors: [{msg: 'Invalid credentials'}] });
        }

        const isMatch = await bcrypt.compare(password, User.password);

        if(!isMatch){
            return res.status(400).json({ errors: [{msg: 'Invalid Credentials'}] })
        }

    
    const payload ={
        User: {
            id: User.id,
        }
    }
    res.send({"userid":payload.User.id});
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});

module.exports = router;