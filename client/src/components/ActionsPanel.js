import React, { Component } from 'react';
import axios from 'axios';

import Button from './ActionsComponents/Button';
import Timer from './ActionsComponents/Timer';
import DoctorVote from './ActionsComponents/DoctorVote';
import DetectiveVote from './ActionsComponents/DetectiveVote';

class ActionsPanel extends Component {
    submitVote(e) {
        if (e.target.getAttribute('data-use') === 'Doctor') {
            const payload = {
                saved: e.target.innerHTML.substr(5)
            }
            axios.post('/doctor-saved', payload);
        } else if (e.target.getAttribute('data-use') === 'Detective') {
            const payload = {
                investigated: e.target.value
            }
            axios.post('/detective-investigated', payload);
        } else {
            const payload = {
                username: this.props.player.username,
                vote: e.target.innerHTML,
                voted: true
            };
            axios.post('/public-vote', payload);
        }
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
                            use="generic" 
                        />
                        <Button 
                            value={'No'} 
                            onClick={this.submitVote.bind(this)} 
                            disabled={this.props.player.voted}
                            use="generic"  
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
                    <div>
                        <div>Doctor Saved</div>
                        <DoctorVote 
                            players={this.props.players} 
                            submitVote={this.submitVote.bind(this)}
                            doctorSaved={this.props.doctorSaved}
                        />
                    </div>
                    <div>
                        <div>Detective Investigated</div>
                        <DetectiveVote 
                            players={this.props.players} 
                            submitVote={this.submitVote.bind(this)}
                            detectiveInvestigated={this.props.detectiveInvestigated}
                        />
                    </div>
                </div>
            );
        }
    }
}

export default ActionsPanel;