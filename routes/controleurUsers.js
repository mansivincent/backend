const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt.utils');
const models = require('../models');

module.exports= {
    register: function (req, res) {
        const Email = req.body.Email;
        const Password = req.body.Password;
        const Phone = req.body.Phone;
        const Pseudo = req.body.Pseudo;
        if (Email == null || Password == null || Pseudo == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
        models.Users.findOne({
            attributes: ['Email'],
            where: { Email: Email }
        })
        .then(function(userFound) {
            if (!userFound) {
                bcrypt.hash(Password, 5, function (err, bcryptedPassword) {
                    const newUser = models.Users.create({
                        Email: Email,
                        Password: bcryptedPassword,
                        Phone: Phone,
                        Pseudo: Pseudo,
                    })
                    .then(function (newUser) {
                        return res.status(201).json({
                            'ID_Users': newUser.id
                        })
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'cannot add user' });
                    });
                });
            } else {
                return res.status(409).json({ 'error': 'user already exist' });
            }
        })
        .catch(function (err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
        });
    },
    login: function(req,res){
        const Email = req.body.Email;
        const Password = req.body.Password;
        if (Email == null || Password == null) {
            return res.status(400).json({ 'error': 'missing parameters' })
          }
        models.Users.findOne({
            where:{Email:Email}
        })
        .then(function(UsersFound){
            if (UsersFound){
                bcrypt.compare(Password,UsersFound.Password,function(errBycrypt,resBycrypt){
                    if(resBycrypt){
                        return res.status(200).json({
                            'ID_Users': UsersFound.id,
                            'token': jwt.generateTokenForUsers(UsersFound)
                        });
                    }else{
                        return res.status(403).json({"error": "invalid password"});
                    }
                });
            }else{
                return res.status(404).json({'error': 'user not exist in DB'});
            }
        })
        .catch(function(err){
            return res.status(500).json({'error': 'unable to veryfy user'});
        });
    },
    getUserProfile: function(req,res){
        const auth = req.headers['authorization'];
        const userid = jwt.getUserID(auth);
        
        if(userid<0){
            return res.status(400).json({'error' : 'wrong token'});
        } 
        models.Users.findOne({
            attributes: ['id','Email','Pseudo','Phone'],
            where: {id: userid}
        }).then(function(Users){
            if(Users){
                res.status(201).json(Users);
            }
            else{
                res.status(404).json({'error': 'cannot fetch user'});
            }
        }).catch(function(err){
            res.status(500).json({'error': 'cannot fetch user'});
        });
    }
}