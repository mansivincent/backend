const express = require('express');
const controleurUsers= require('./routes/controleurUsers');
const controleurTasks= require('./routes/controleurTasks');
const controleurUpVote= require('./routes/controleurUpVote');


exports.router=(function(){
    const apirouter = express.Router();
    apirouter.route('/users/register/').post(controleurUsers.register);
    apirouter.route('/users/login/').post(controleurUsers.login);
    apirouter.route('/users/recover/').get(controleurUsers.getUserProfile);
    apirouter.route('/task/create').post(controleurTasks.createTasks);
    apirouter.route('/task/list').post(controleurTasks.listTasks);
    apirouter.route('/Task/vote/down').post(controleurUpVote.down);
    apirouter.route('/Task/vote/up').post(controleurUpVote.up);
    return apirouter;
})();