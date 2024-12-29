import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    // whatsappNumber: {
    //     type: String,
    //     required: [true, "Please provide a WhatsApp number"],
    //     unique: true,
    // },
    isVerfied: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    name: {
        type: String,
        // required: [true, "Please provide a name"],
    },
    college: {
        type: String,
        // required: [true, "Please provide a college name"],
    },
    city: {
        type: String,
        // required: [true, "Please provide a city"],
    },
    profileImage: {
        type: String,
        default: "", // You can set a default image URL if needed
    },
    bookIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        }
    ],
})

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;