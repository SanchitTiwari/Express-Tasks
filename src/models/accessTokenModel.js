const mongoose = require('mongoose');
// created access token model for handleling login requests by issueing acceess tokens which are valid for 1 hour
const accessTokenSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    access_token: { type: String, required: true },
    expiry: { type: Date, required: true }
});

module.exports = mongoose.model('AccessToken', accessTokenSchema);