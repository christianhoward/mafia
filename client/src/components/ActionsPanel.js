import React, { Component } from 'react';
import axios from 'axios';

import Button from './ActionsComponents/Button';
import Timer from './ActionsComponents/Timer';
import DoctorVote from './ActionsComponents/DoctorVote';
import DetectiveVote from './ActionsComponents/DetectiveVote';
import MafiaVote from './ActionsComponents/MafiaVote';
import PublicVote from './ActionsComponents/PublicVotePanel';

class ActionsPanel extends Component {
    componentDidMount() {
        // this.setStartTimeout = setTimeout(() => {
        //     this.runGame();
        // }, 10000);
    }
    submitVote(e) {
        if (e.target.getAttribute('data-use') === 'Doctor') {
            const payload = {
                saved: e.target.value
            }
            axios.post('/doctor-saved', payload);
        } else if (e.target.getAttribute('data-use') === 'Detective') {
            const payload = {
                investigated: e.target.value
            }
            axios.post('/detective-investigated', payload);
        } else if (e.target.getAttribute('data-use') === 'Mafia') {
            const payload = {
                eliminationVote: e.target.value
            }
            axios.post('/mafia-voted', payload);
        } else if (e.target.getAttribute('data-use') === 'Public-Nomination') {
            const payload = {
                publicNomination: e.target.value
            }
            axios.post('/public-nomination', payload);
        } else if (e.target.getAttribute('data-use') === 'Public-Seconded') {
            const payload = {
                username: e.target.value,
                seconded: true
            };
            axios.post('/public-seconded', payload);
        } else if (e.target.getAttribute('data-use') === 'Public-Fate') {
            const payload = {
                publicNomination: {
                    username: e.target.value,
                    vote: e.target.innerHTML
                },
                username: this.props.player.username
            }
            console.log(payload);
            axios.post('/public-fate', payload)
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
    game() {
        let payload;
        if (this.props.gameTime === 'Day') {
            payload = { gameTime: 'Night', timer: 15 };
        } else if (this.props.gameTime === 'Night') {
            payload = { gameTime: 'Day', timer: 30 };
        } else {
            this.assignRoles();
            payload = { gameTime: 'Day', timer: 30 };
        }
        axios.post('/phase-shift', payload);
        this.gameTimeout = setTimeout(() => {
            this.game();
        }, payload.timer * 1000);
    }
    runGame() {
        this.setTimeout = setTimeout(() => {
            this.game();
        }, 1000);
    }
    renderNight() {
        if (this.props.player.role === 'Mafia') {
            return <MafiaVote 
                    players={this.props.players} 
                    submitVote={this.submitVote.bind(this)}
                />
        } else if (this.props.player.role === 'Doctor') {
            return <DoctorVote 
                    players={this.props.players} 
                    submitVote={this.submitVote.bind(this)}
                    doctorSaved={this.props.doctorSaved}
                />
        } else if (this.props.player.role === 'Detective') {
            return <DetectiveVote 
                    players={this.props.players} 
                    submitVote={this.submitVote.bind(this)}
                    detectiveInvestigated={this.props.detectiveInvestigated}
                />
        } else {
            return <div>Nothing to do but sleep the night away!</div>
        }
    }
    render() {
        if (this.props.gameTime === 'Day') {
            return (
                <div className="actions">
                    <div>
                        <Timer countdownStart={this.props.timer} />
                        <div>You are {this.props.player.role}</div>
                        <PublicVote 
                            players={this.props.players} 
                            submitVote={this.submitVote.bind(this)}
                            publicNominations={this.props.publicNominations}
                        />
                    </div>
                </div>
            );
        } else if (this.props.gameTime === 'Night') {
            return (
                <div>
                    <Timer countdownStart={this.props.timer} />
                    <div>You are {this.props.player.role}</div>
                    <div>{this.renderNight()}</div>
                </div>
            );
        } else { 
            return (
                <div>
                    <div>
                        Waiting to start the game
                    </div>
                    <Button 
                        value={'Start'} 
                        onClick={this.runGame.bind(this)} 
                        disabled={null}
                        use="generic"  
                    />
                </div>
            );
        }
    }
}

export default ActionsPanel;