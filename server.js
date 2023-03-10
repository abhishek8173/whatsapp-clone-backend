// import
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';

// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1476441",
    key: "f90ba83543755f021ee3",
    secret: "3bc8177dcd2e5333ad4b",
    cluster: "ap2",
    useTLS: true
});

// middleware
app.use(cors());
app.use(express.json());

// DB config
const connection_url = 'mongodb+srv://Abhishek8173:Avengers2018@cluster0.2mikirs.mongodb.net/whatsappDB?retryWrites=true&w=majority';
mongoose.connect(connection_url);

const db = mongoose.connection;

db.once('open', ()=>{
    console.log("DB connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change)=>{
        console.log("A change occurred ", change);

        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', {
                name:  messageDetails.name,
                message: messageDetails.message,
                date: messageDetails.date,
                time: messageDetails.timestamp,
                received: messageDetails.received,
            });
        }else{
            console.log("Error triggering Pusher");
        }
    });
});

// ????

// api routes
app.get('/', (req, res)=>res.status(200).send('Hello!!!'));

app.get('/messages/sync', (req, res)=>{
    Messages.find((err, data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(data);
        }
    });
});

app.post('/messages/new', (req, res)=>{
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    });
});

// listen
app.listen(port, ()=>console.log(`Listening on localhost:${port}`));