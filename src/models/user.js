const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: 'Your email is required',
        trim: true
    },

    password: {
        type: String,
        required: 'Your password is required',
        max: 100
    },

    firstName: {
        type: String,
        required: 'First Name is required',
        max: 100
    },

    lastName: {
        type: String,
        required: 'Last Name is required',
        max: 100
    },

    username: {
        type: String,
        required: false,
        max: 100
    },

    role: {
        type: String,
        required: false,
        max: 100
    },

    department: {
        type: String,
        required: false,
        max: 100
    },

    bio: {
        type: String,
        required: false,
        max: 255
    },

    profileImage: {
        type: String,
        required: false,
        max: 255
    },
}, {timestamps: true});


// const [gender, setGender] = useState("");
// const [dob, setDOB] = useState("");//(dp)

UserSchema.pre('save',  function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let payload = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        id: this._id
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

module.exports = mongoose.model('Users', UserSchema);