import React, { Component } from 'react';
import axios from 'axios';

import Button from './ActionsComponents/Button';
import Timer from './ActionsComponents/Timer';

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
    assignRoles() {
        axios.post('/assign-roles', []);
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
                            onClick={this.submitVote.bind(this)} 
                            disabled={this.props.player.voted} 
                        />
                        <Button 
                            value={'No'} 
                            onClick={this.submitVote.bind(this)} 
                            disabled={this.props.player.voted} 
                        />
                    </div>
                    <div>
                        <div>Assign Roles Test</div>
                        <button onClick={this.assignRoles.bind(this)}>Assign Roles</button>
                    </div>
                    <div>
                        <div>Elimination Test</div>
                        <button onClick={this.handleElimination.bind(this)}>Eliminate Myself</button>
                    </div>
                    <div>
                        <div>Timer Test</div>
                        <Timer time={this.props.time} countdownStart={5}/>
                    </div>
                </div>
            );
        }
    }
}

export default ActionsPanel;