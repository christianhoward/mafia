import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class JoinRooms extends Component {
    joinRoom(username, room) {
        axios.post('/join-chat', { username, room })
            .then(res => {
                this.props.history.push(`/${room}`);
            });
    }
    render() {
        return (
            <div style={{ textAlign: 'center', margin: 'auto', width: '50%', paddingTop: '100px' }}>
                <input type='text' name='username' placeholder="Enter username" onChange={this.props.handleChange} /><br />
                <input type='text' name='room' placeholder="Enter room name" onChange={this.props.handleChange} /><br />
                <button onClick={(e) => this.joinRoom(this.props.username, this.props.room)}>Join</button>
            </div>
        );
    }
}

export default withRouter(JoinRooms);