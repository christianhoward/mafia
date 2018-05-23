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
            message: req.body.message,
            timeStamp: req.body.timeStamp
        });
        res.send('Message sent');
    });
    
    app.post('/update-player-list', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'update_player_list', req.body);
        res.send('List updated');
    });
    
    app.post('/public-vote', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'public_vote', {
            username: req.body.username,
            vote: req.body.vote,
            voted: req.body.voted
        });
        res.send('vote cast');
    });

    app.post('/assign-roles', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'assign_roles', req.body);
        res.send('roles assigned');
    });

    app.post('/set-timer', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'set_timer', req.body);
        res.send('timer set');
    });

    app.post('/doctor-saved', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'doctor_saved', req.body);
        res.send(`Doctor Saved ${req.body.saved}`);
    });

    app.post('/detective-investigated', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'detective_investigated', req.body);
        res.send(`Detective investigated ${req.body.investigated}`);
    });

    app.post('/mafia-voted', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'mafia_voted', req.body);
        res.send(`Mafia voted ${req.body.investigated}`);
    });

    app.post('/public-nomination', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'public_nomination', req.body);
        res.send(`Public Nomination for ${req.body.publicNomination}`);
    });

    app.post('/public-seconded', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'public_seconded', {
            username: req.body.username,
            seconded: req.body.secoded
        });
        res.send(`Public Seconded for ${req.body.username}`);
    });

    app.post('/public-fate', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'public_fate', {
            username: req.body.username,
            publicNomination: req.body.publicNomination
        });
        res.send(`Public voted for ${req.body.publicNomination.username}`);
    });

    app.post('/phase-shift', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'phase_shift', {
            gameTime: req.body.gameTime,
            timer: req.body.timer
        });
        res.send('Phase shift');
    });

    app.post('/elimination', (req, res) => {
        pusher.trigger(`presence-${req.session.room}`, 'elimination', {
            username: req.body.username
        });
        res.send(`${req.body.username} eliminated`);
    });

}