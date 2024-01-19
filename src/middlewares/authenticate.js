const passport = require("passport");

module.exports = (req, res, next) => {
    passport.authenticate('jwt', function(err, user, info) {
        if (err) {
            // console.error('Passport authentication error:', err);
            return next(err)
        };

        if (!user) {
            // console.log('No user found in authentication');
            return res.status(401).json({message: "Unauthorized Access - No Token Provided!"});
        }

        // console.log('User authenticated:', user);

        req.user = user;

        next();

    })(req, res, next);
};