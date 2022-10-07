import mongoose from "mongoose";

const whatsappSchema = mongoose.Schema({
    isgroup: Boolean,
    group: String,
    name: String,
    receiver: String,
    message: String,
    date: String,
    time: String,
    received: Boolean,
    read: Boolean
});

export default mongoose.model('messagecontents', whatsappSchema)