const {Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'superadmin']
    },
    userName: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
},
    { timestamps: true }
);

module.exports = model('users', userSchema);