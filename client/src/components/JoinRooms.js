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
            <div style={{ textAlign: 'center', margin: 'auto', width: '40%', marginTop: '100px', border: '1px solid black', boxSizing: 'border-box', paddingTop: '10px' }}>
                <div style={{ paddingBottom: '10px' }}>
                    <input type='text' name='username' placeholder="Enter username" onChange={this.props.handleChange} className="join" />
                </div>
                <div style={{ paddingBottom: '10px' }}>
                    <input type='text' name='room' placeholder="Enter room name" onChange={this.props.handleChange} className="join" />
                </div>
                <div style={{ paddingBottom: '10px' }}>
                    <button onClick={(e) => this.joinRoom(this.props.username, this.props.room)}>Join</button>
                </div>
            </div>
        );
    }
}

export default withRouter(JoinRooms);