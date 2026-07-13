const mongoose = require("mongoose");

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.log("No MONGO_URI provided; running without MongoDB.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;