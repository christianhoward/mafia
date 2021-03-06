import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Pusher from 'pusher-js';
import axios from 'axios';

import Chat from './ChatPanel';
import Actions from './ActionsPanel';
import PlayersPanel from './PlayersPanel';

import { pusherConnection } from './config/keys';

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inProgress: false,
            eliminated: [{ group: 'Mafia', eliminated: 0 }, { group: 'Villagers', eliminated: 0 }],
            joined: '',
            chats: [],
            mafiaChats: [{ message: "This is the Mafia Only chat. During the Night phase of the game, you can use this chat window to talk to the other members of the Mafia to determine who you want to eliminate.", username: "Admin", timeStamp: new Date().toLocaleDateString(navigator.language, { hour: '2-digit', minute: '2-digit' })} ],
            players: [],
            count: 0,
            // loading: true,
            chatLocked: false,
            doctorSaved: '',
            detectiveInvestigated: [],
            mafiaVoted: [],
            publicNominations: [],
            gameTime: null,
            timer: ''
        };
        this.updatePlayerList = this.updatePlayerList.bind(this);
    }
    componentDidMount() {
        // If no username, redirect to the join room page
        if (!this.props.username) {
            this.props.history.push('/');
        }
        // Connect to Pusher Instance
        const pusher = new Pusher(pusherConnection.key, {
            cluster: pusherConnection.cluster,
            encrypted: true,
            authEndpoint: 'pusher/auth'
        });
        // Set joined to true
        this.setState({ joined: true });
        // Create Pusher Channel Instance
        const channel = pusher.subscribe(`presence-${this.props.room}`);
        // Logic for when someone joins the room
        channel.bind('pusher:subscription_succeeded', (members) => {
            let players = [];
            Object.keys(members.members).forEach(member => {
                players.push({ 
                    username: member,
                    vote: '',
                    voted: false,
                    eliminated: false,
                    role: ''
                });
            });
            this.updatePlayerList(players);
        });
        // Logic for when a new member is added to the chat
        channel.bind('pusher:member_added', (member) => {
            // Updates chats for everyone and welcomes new players
            this.setState({ chats: [...this.state.chats, { username: 'Admin', message: `${member.id} has joined the chat.`, timeStamp: new Date().toLocaleDateString(navigator.language, { hour: '2-digit', minute: '2-digit' })} ] });
        });
        // Logic for sending messages and updating the chat.
        channel.bind('message_sent', data => {
            if (data.chat === 'chat') {
                this.setState({ chats: [...this.state.chats, data] });
            } else {
                this.setState({ mafiaChats: [...this.state.mafiaChats, data ]});
            }
        });
        // Logic for updating the player's list when new players join.
        channel.bind('update_player_list', data => {
            this.setState({ players: data.players, count: data.players.length });
        });
        channel.bind('set_roles', data => {
            let newState = this.state.players;
            let extras = [];
            let roles = ['Mafia', 'Mafia', 'Doctor', 'Detective', 'Villager'];
            if (roles.length !== newState.length) {
                for (let i=0; i < newState.length-roles.length; i++) {
                    extras.push('Villager');
                };
                roles.push(...extras);
            }
            newState.forEach(player => {
                let i = Math.floor(data.randomizer * roles.length);
                player.role = roles[i];
                roles.splice(i, 1);
            });
            this.setState({ players: newState });
        });
        channel.bind('public_vote', data => {
            let newState = this.state.players;
            newState.filter(player => (player.username === data.username)).map(player => {
                player.vote = data.vote;
                player.voted = data.voted;
            });
            this.setState({ players: newState });
        });
        channel.bind('elimination', data => {
            let newState = this.state.players;
            let newEliminated = this.state.eliminated;
            newState.filter(player => (player.username === data.username)).map(player => {
                player.eliminated = true;
            }); 
            newState.find(player => player.username === data.username).role === 'Mafia' ? newEliminated[0].eliminated += 1 : newEliminated[1].eliminated += 1;
            this.setState({ players: newState, chats: [...this.state.chats, { username: 'Admin', message: `${data.username} has been eliminated.`, timeStamp: new Date().toLocaleDateString(navigator.language, { hour: '2-digit', minute: '2-digit' })} ], publicNominations: [], mafiaVoted: [], eliminated: newEliminated });
        });
        channel.bind('set_timer', data => {
            this.setState({ time: data.time });
        });
        channel.bind('doctor_saved', data => {
            this.setState({ doctorSaved: data.saved });
        });
        channel.bind('detective_investigated', data => {
            this.setState({ detectiveInvestigated: [...this.state.detectiveInvestigated, data.investigated] });
        });
        channel.bind('mafia_voted', data => {
            let newState = this.state.mafiaVoted;
            if (newState.length > 0) {
                newState.filter(player => (player.username === data.eliminationVote)).map(player => {
                    player.count += 1;
                });
            } else {
                newState.push({ username: data.eliminationVote, count: 1});
            }
            this.setState({ mafiaVoted: newState });
        });
        channel.bind('public_nomination', data => {
            this.setState({ publicNominations: [...this.state.publicNominations, { username: data.publicNomination, seconded: false }] });
        });
        channel.bind('public_seconded', data => {
            let newState = this.state.publicNominations;
            newState.filter(player => (player.username === data.username)).map(player => {
                player.seconded = true;
                player.fate = 0;
                player.count = 0;
            });
            this.setState({ publicNominations: newState });
        });
        channel.bind('public_fate', data => {
            let newState = this.state.publicNominations;
            newState.filter(player => (player.username === data.publicNomination.username)).map(player => {
                player.fate = data.publicNomination.vote === 'Yes' ? player.fate+1 : player.fate-1;
                player.count += 1;
            });
            this.setState({ publicNominations: newState });
        });
        channel.bind('phase_shift', data => {
            if (this.state.inProgress === false) {
                this.setState({ gameTime: data.gameTime, timer: data.timer, chatLocked: data.chatLocked, publicNominations: [], inProgress: true });
            } else {
                this.setState({ gameTime: data.gameTime, timer: data.timer, chatLocked: data.chatLocked, publicNominations: [] });
            }
        });
        channel.bind('pusher:member_removed', (member) => {
            let newState = this.state.players;
            newState.filter(player => (player.username === member.id)).map(player => {
                player.eliminated = true;
            });
            let newEliminated = this.state.eliminated;
            newState.find(player => player.username === member.id).role === 'Mafia' ? newEliminated[0].eliminated += 1 : newEliminated[1].eliminated += 1;
            this.setState({ chats: [...this.state.chats, { username: 'Admin', message: `${member.id} has left the game.`, timeStamp: new Date().toLocaleDateString(navigator.language, { hour: '2-digit', minute: '2-digit' })} ], players: newState, eliminated: newEliminated });
        });
        // setTimeout(() => { this.setState({ loading: false }) }, 4000);
    }
    updatePlayerList(players) {
        const payload = {
            players
        }
        axios.post('/update-player-list', payload);
    }
    renderActions() {
        if (this.state.eliminated[0].eliminated === 2) {
            return <div>Villagers Win!</div>
        } else if (this.state.eliminated[1].eliminated === 5) {
            return <div>Mafia Wins!</div>
        } else {
            return <Actions 
                player={this.state.players.find(player => player.username === this.props.username)}
                players={this.state.players}
                time={this.state.time}
                doctorSaved={this.state.doctorSaved}
                detectiveInvestigated={this.state.detectiveInvestigated}
                mafiaVoted={this.state.mafiaVoted} 
                publicNominations={this.state.publicNominations}
                timer={this.state.timer}
                gameTime={this.state.gameTime}
                count={this.state.count}
            />
        }
    }
    render() {
        // if (this.state.loading) {
        //     return <div className="loader"></div> 
        // } else {
            return (
                <div>
                    <div className="players-grid">
                        <PlayersPanel username={this.props.username} players={this.state.players} />
                    </div>
                    <div className="interactions-grid">
                        <Chat {...this.props} {...this.state} player={this.state.players.find(player => player.username === this.props.username)} />
                        {this.renderActions()}
                    </div>
                </div>
            );
        // }
    }
}

export default withRouter(Room);