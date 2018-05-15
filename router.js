const bodyParser = require('body-parser');
const cors = require('cors');
const Pusher = require('pusher');
const session = require('express-session');

const serverConfig = require('./config/keys');

// Create an instance of Pusher
const pusher = new Pusher({
    appId: serverConfig.pusherConnection.appId,
    key: serverConfig.pusherConnection.key,
    secret: serverConfig.pusherConnection.secret,
    cluster: serverConfig.pusherConnection.cluster,
    encrypted: true
});


module.exports = function(app) {
    // Session middleware
    app.use(session({
        secret: serverConfig.sessionSecret,
        resave: true,
        saveUninitialized: true
    }));

    // CORS and bodyParser middleware
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.post('/join-chat', (req, res) => {
        // Store username and room in session
        req.session.room = req.body.room;
        req.session.username = req.body.username;
        res.json('Joined');
    });
    
    app.post('/pusher/auth', (req, res) => {
        const socketId = req.body.socket_id;
        const channel = req.body.channel_name;
        // Retrieve username from session and use as presence channel user_id
        const presenceData = {
            user_id: req.session.username
        };
        const auth = pusher.authenticate(socketId, channel, presenceData);
        res.send(auth);
    })
    
    app.post('/send-message', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'message_sent', {
            username: req.body.username,
            message: req.body.message
        });
        res.send('Message sent');
    });
    
    app.post('/update-player-list', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'update_player_list', req.body);
        res.send('List updated');
    });
    
    app.post('/ready-up', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'ready_up', {
            username: req.body.username,
            vote: req.body.vote,
            voted: req.body.voted
        });
        res.send('vote cast');
    });
}