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
          joined: '',
        //   members: '',
          chats: [],
          players: [],
          count: 0,
          loading: true
        };
        this.updatePlayerList = this.updatePlayerList.bind(this);
    }
    componentDidMount() {
        // If no username, redirect to the join room page
        if (!this.props.username) {
            this.props.history.push('/');
        }
        // Connect to Pusher Instance
        console.log(pusherConnection);
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
                    voted: false
                 });
            });
            // Updates the player list for all players
            this.updatePlayerList(players);
            // Sets the members in the room for Pusher -- THIS MIGHT NOT BE NEEDED
            // this.setState({ members });
        });
        // Logic for when a new member is added to the chat
        channel.bind('pusher:member_added', (member) => {
            // Updates chats for everyone and welcomes new players
            this.setState({ chats: [...this.state.chats, { username: 'Admin', message: `${member.id} has joined the chat.`} ] });
        });
        // Logic for sending messages and updating the chat.
        channel.bind('message_sent', data => {
            this.setState({ chats: [...this.state.chats, data] });
        });
        // Logic for updating the player's list when new players join.
        channel.bind('update_player_list', data => {
            this.setState({ players: data, count: data.length });
        });
        channel.bind('ready_up', data => {
            console.log('ready', data);
            let newState = this.state.players;
            newState.filter(player => (player.username === data.username)).map(player => {
                player.vote = data.vote;
                player.voted = data.voted;
            });
            console.log(newState);
            this.setState({ players: newState });
        });
        setTimeout(() => { this.setState({ loading: false }) }, 4000);
    }
    updatePlayerList(players) {
        axios.post('/update-player-list', players);
    }
    renderMembers() {
        if (this.state.players) {
            return this.state.players.map(player => {
                return (
                    <li>{player.username} - {player.vote}</li>
                );
            });
        }
    }
    render() {
        // if (this.state.loading) {
        //     return <div className="loader"></div> 
        // } else {
            return (
                <div>
                    <div className="players-grid">
                        <PlayersPanel players={this.state.players} />
                    </div>
                    <div className="interactions-grid">
                        <Chat {...this.props} {...this.state} />
                        <Actions 
                            player={this.state.players.find(player => player.username === this.props.username)} 
                        />
                    </div>
                </div>
            );
        // }
    }
}

export default withRouter(Room);