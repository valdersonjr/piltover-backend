const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/user');

exports.userSignUp = async function(req, res) {
    User.findOne({ where: { email: req.body.email } })
    .then(user => {
            if(user !== null){
                console.log("AAAAAAAAAAAAAAAAAAAAAAA");
                return res.status(409).json({
                    message: 'User already exists!'
                });
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK");
                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        const newUser = {
                            email: req.body.email,
                            password: hash
        
                        }
        
                        User.create(newUser)
                            .then(result => {
                                console.log(result.dataValues);
                                return res.status(201).json({
                                    message: 'User created!'
                                });
                            })
                            .catch(err => {
                                return res.status(500).json({
                                    err: err
                                });
                            });
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
}

exports.userLogin = async function(req, res) {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if(!user){
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            }

            const userData = user.dataValues;

            bcrypt.compare( req.body.password, userData.password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: 'Auth Failed!'
                    });
                }

                if(result) {
                    const token = jwt.sign({
                        id: userData.id,
                        email: userData.email
                    }, process.env.JWT_KEY, {expiresIn: "1h" });

                    return res.status(200).json({
                        message: 'Auth Sucessfull',
                        token: token
                    });

                    return res.status(401).json({
                        messsage: 'Auth failed'
                    });
                }
            }).catch(err => {
                console.log(err);
                res.status(500).json({ err: err });
            });
        })
}