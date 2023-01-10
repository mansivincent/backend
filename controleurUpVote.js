const model = require('../models');
var jwt = require('../utils/jwt.utils');


module.exports={
    up: function(req,res){
        const auth = req.headers['authorization'];
        const Users_id = jwt.getUsers_id(auth);
        const Tasks_id = parseInt(req.params.Tasks_id);
        if(Tasks_id<=0){
            throw new Error("invalid parameters");
        }
     models.Tasks.findOne({
        where: { id: Tasks_id }
        }, function(err, TasksFound) {
            if (err) {
                return res.status(500).json({ 'error': 'unable to verify Tasks' });
            }
            if (!TasksFound) {
                return res.status(404).json({ 'error': 'post already voted' });
            }

            models.User.findOne({
                where: { id: Users_id }
            }, function(err, UsersFound) {
                if (err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                }
                if (!UsersFound) {
                    return res.status(404).json({ 'error': 'user not exist' });
                }

                models.votes.findOne({
                    where: {
                        Users_id: Users_id,
                        Tasks_id: Tasks_id
                    }
                }, function(err, userAlreadyvotesdFound) {
                    if (err) {
                        return res.status(500).json({ 'error': 'unable to verify is user already voted' });
                    }
                    if (!userAlreadyvotesdFound) {
                        TasksFound.addUser(UsersFound, { isvotes: Voted }, function(err, alreadyvotesFound) {
                            if (err) {
                                return res.status(500).json({ 'error': 'unable to set user reaction' });
                            }
                            TasksFound.update({
                                votes: TasksFound.votes + 1,
                            }, function(err) {
                                if (err) {
                                    return res.status(500).json({ 'error': 'cannot update Tasks votes counter' });
                                }
                                return res.status(201).json(TasksFound);
                            });
                        });
                    } else {
                        if (userAlreadyvotesdFound.isvotes === Voted) {
                            userAlreadyvotesdFound.update({
                                isvotes: Voted,
                            }, function(err) {
                                if (err) {
                                    return res.status(500).json({ 'error': 'cannot update user reaction' });
                                }
                                TasksFound.update({
                                    votes: TasksFound.votes + 1,
                                }, function(err) {
                                    if (err) {
                                        return res.status(500).json({ 'error': 'cannot update Tasks votes counter' });
                                    }
                                    return res.status(201).json(TasksFound);
                                });
                            });
                        } else {
                            return res.status(409).json({ 'error': 'Task already voted' });
                        }
                    }
                });
            });
        });
    },
    down : function(req,res){
        const auth = req.headers['authorization'];
        const Users_id = jwt.getUsers_id(auth);
        const Tasks_id = parseInt(req.params.Tasks_id);
        if(Tasks_id<=0){
            throw new Error("invalid parameters");
        }
        models.Tasks.findOne({
            where: { id: Tasks_id }
            }, function(err, TasksFound) {
                if (err) {
                    return res.status(500).json({ 'error': 'unable to verify Tasks' });
                }
                if (!TasksFound) {
                    return res.status(404).json({ 'error': 'post already voted' });
                }
    
                models.User.findOne({
                    where: { id: Users_id }
                }, function(err, UsersFound) {
                    if (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    }
                    if (!UsersFound) {
                        return res.status(404).json({ 'error': 'user not exist' });
                    }
    
                    models.votes.findOne({
                        where: {
                            Users_id: Users_id,
                            Tasks_id: Tasks_id
                        }
                    }, function(err, userAlreadyvotesdFound) {
                        if (err) {
                            return res.status(500).json({ 'error': 'unable to verify is user already voted' });
                        }
                        if (!userAlreadyvotesdFound) {
                            TasksFound.addUser(UsersFound, { isvotes: unvoted }, function(err, alreadyvotesFound) {
                                if (err) {
                                    return res.status(500).json({ 'error': 'unable to set user reaction' });
                                }
                                TasksFound.update({
                                    votes: TasksFound.votes - 1,
                                }, function(err) {
                                    if (err) {
                                        return res.status(500).json({ 'error': 'cannot update Tasks votes counter' });
                                    }
                                    return res.status(201).json(TasksFound);
                                });
                            });
                        } else {
                            if (userAlreadyvotesdFound.isvotes === unvoted) {
                                userAlreadyvotesdFound.update({
                                    isvotes: Voted,
                                }, function(err) {
                                    if (err) {
                                        return res.status(500).json({ 'error': 'cannot update user reaction' });
                                    }
                                    TasksFound.update({
                                        votes: TasksFound.votes - 1,
                                    }, function(err) {
                                        if (err) {
                                            return res.status(500).json({ 'error': 'cannot update Tasks votes counter' });
                                        }
                                        return res.status(201).json(TasksFound);
                                    });
                                });
                            } else {
                                return res.status(409).json({ 'error': 'Task already voted' });
                            }
                        }
                    });
                });
            });
        }
    }
