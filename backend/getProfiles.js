require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const CreatorProfile = mongoose.connection.collection('creatorprofiles');
    const profiles = await CreatorProfile.find({}).toArray();
    console.log(JSON.stringify(profiles, null, 2));
    process.exit(0);
});
