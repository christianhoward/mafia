import React, { Component } from 'react';
import axios from 'axios';

import Button from './ActionsComponents/Button';

class ActionsPanel extends Component {
    submitVote(e) {
        const payload = {
            username: this.props.player.username,
            vote: e.target.innerHTML,
            voted: true
        };
        axios.post('/ready-up', payload);
    }
    handleElimination() {
        const payload = {
            username: this.props.player.username
        };
        axios.post('/elimination', payload);
    }
    render() {
        if (!this.props.player) {
            return null
        } else {
            return (
                <div className="actions">
                    <div>Actions</div>
                    <div>
                        <div>General Yes/No Voting Test</div>
                        <Button 
                            value={'Yes'} 
                            submitVote={this.submitVote.bind(this)} 
                            player={this.props.player} 
                        />
                        <Button 
                            value={'No'} 
                            submitVote={this.submitVote.bind(this)} 
                            player={this.props.player} 
                        />
                    </div>
                    <div>
                        <div>Elimination Test</div>
                        <button onClick={this.handleElimination.bind(this)}>Eliminate Myself</button>
                    </div>
                </div>
            );
        }
    }
}

export default ActionsPanel;