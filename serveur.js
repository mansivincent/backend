const express = require('express');
const serveur = express();
const port = process.env.PORT || 8000;
const bodyparser = require('body-parser');
const apirouter = require('./apirouter').router;



serveur.use(bodyparser.urlencoded({extended:true}));

serveur.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send('Hello world !!');
});
serveur.use('/api/',apirouter);
serveur.use(bodyparser.json());

serveur.listen(port, () => {
    console.log('Server app listening on port ' + port);
});


