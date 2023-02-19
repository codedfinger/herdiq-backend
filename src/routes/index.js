const auth = require('./auth');
const user = require('./user');
const team = require('./team');
 

const authenticate = require('../middlewares/authenticate');

module.exports = app => {
    app.get('/', (req, res) => {
        res.status(200).send({ message: "Welcome to the TARE REST API. Register or Login to test Authentication."});
    });

    app.use('/api/auth', auth);
    app.use('/api/user', authenticate, user);
    app.use('/api/team', authenticate, team);

};  