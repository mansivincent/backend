const jwt = require('jsonwebtoken');
const signature = 'kssdfevdsvz232042TFDVSV43ZV42SDVv24Rfds';

module.exports = {
    generateTokenForUsers: function(UsersData){
        return jwt.sign({
            ID_Users: UsersData.id,
        },
        signature,{
            })
    },
    Authorization: function(authorization){
        return (authorization != null)?authorization.replace('Bearer ','') : null;
    },
    getUserID: function(authorization){
        const ID_Users = -1;
        const token = module.exports.Authorization(authorization);
        if(token !=null){
            try{
                const decoded = jwt.verify(token,signature);
                if(decoded != null){
                    console.log(decoded)
                    ID_Users = jwt.ID_Users;
                }
            }catch(err){
            }
        }
        return ID_Users;
    }
}