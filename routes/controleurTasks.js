var models   = require('../models');
var jwt = require('../utils/jwt.utils');

module.exports = {
  createTasks: function(req, res) {
    var headerAuth  = req.headers['authorization'];
    var ID_Users = jwt.getUserID(headerAuth);

    var Name = req.body.Name;
    var Description = req.body.Description;

    if (Name == null || Description == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    models.Users.findOne({
      where: { id: ID_Users }
    }, function(err, userFound) {
      if (err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      }

      if (userFound) {
        models.Tasks.create({
          Name  : Name,
          Description: Description,
          Done  : 0,
          ID_Users : userFound.id
        }, function(err, newTasks) {
          if (err) {
            return res.status(500).json({ 'error': 'cannot post Tasks' });
          }

          return res.status(201).json(newTasks);
        });
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    });
  },
  listTasks: function(req, res) {
    var fields  = req.query.fields;
    var limit   = parseInt(req.query.limit);
    var offset  = parseInt(req.query.offset);
    var order   = req.query.order;

    models.Tasks.findAll({
      order: [(order != null) ? order.split(':') : ['Name', 'ASC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      limit: (!isNaN(limit)) ? limit : null,
      offset: (!isNaN(offset)) ? offset : null,
      include: [{
        model: models.Users,
        attributes: [ 'username' ]
      }]
    }, function(err, Tasks) {
      if (err) {
        console.log(err);
        res.status(500).json({ "error": "invalid fields" });
      }

      if (Tasks) {
        res.status(200).json(Tasks);
      } else {
        res.status(404).json({ "error": "no Tasks found" });
      }
    });
  }
}