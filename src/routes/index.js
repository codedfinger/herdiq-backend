const auth = require('./auth');
const user = require('./user');
const breed = require('./breed');
const animal = require('./animal');
const shed = require('./shed');
const vaccine = require('./vaccine')
const progeny = require('./progeny')
const breeding = require('./breeding')
const milk = require('./milk')

const authenticate = require('../middlewares/authenticate');

module.exports = app => {
    app.get('/', (req, res) => {
        res.status(200).send({ message: "Welcome to the TARE REST API. Register or Login to test Authentication."});
    });

    app.use('/api/auth', auth);
    app.use('/api/user', authenticate, user);
    app.use('/api/breed', breed);
    app.use('/api/animal', animal);
    app.use('/api/shed', shed);
    app.use('/api/vaccine', vaccine);
    app.use('/api/progeny', progeny);
    app.use('/api/breeding', breeding);
    app.use('/api/milk', milk);




};  