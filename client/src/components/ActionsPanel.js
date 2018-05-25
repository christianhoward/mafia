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
        // }, 15000);
    }
    componentWillUnmount() {
        clearTimeout(this.setTimeout);
        clearTimeout(this.gameTimeout)
        this.setTimeout = undefined;
        this.gameTimeout = undefined;
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
    game() {
        let payload;
        if (this.props.gameTime === 'Day') {
            if (this.props.publicNominations.length > 0 && this.props.publicNominations[0].fate > 0) {
                axios.post('/elimination', { username: this.props.publicNominations[0].username });
            }
            payload = { gameTime: 'Night-Mafia', timer: 25, chatLocked: true };
        } else if (this.props.gameTime === 'Night-Mafia') {
            payload = { gameTime: 'Night-Doctor', timer: 20, chatLocked: true };
        } else if (this.props.gameTime === 'Night-Doctor') {
            payload = { gameTime: 'Night-Detective', timer: 15, chatLocked: true };
        } else if (this.props.gameTime === 'Night-Detective') {
            if (this.props.publicNominations.length > 0 && this.props.mafiaVoted[0].count >= 1 && this.props.mafiaVoted[0].username !== this.props.doctorSaved) {
                axios.post('/elimination', { username: this.props.mafiaVoted[0].username });
            }
            payload = { gameTime: 'Day', timer: 30, chatLocked: false };
        } else {
            // this.assignRoles();
            payload = { gameTime: 'Day', timer: 30, chatLocked: false };
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
            if (this.props.gameTime === 'Night-Mafia') {
                return <MafiaVote 
                    players={this.props.players} 
                    submitVote={this.submitVote.bind(this)}
                />
            } else {
                return <div className="role">Sleep well!</div>
            }
        } else if (this.props.player.role === 'Doctor') {
            if (this.props.gameTime === 'Night-Mafia') {
                return <div className="role">Think about who you will save.</div>
            } else if (this.props.gameTime === 'Night-Doctor') {
                return <DoctorVote 
                    players={this.props.players} 
                    submitVote={this.submitVote.bind(this)}
                    doctorSaved={this.props.doctorSaved}
                />
            } else {
                return <div className="role">Sleep well!</div>
            }
        } else if (this.props.player.role === 'Detective') {
            if (this.props.gameTime === 'Night-Detective') {
                return <DetectiveVote 
                    players={this.props.players} 
                    player={this.props.player}
                    submitVote={this.submitVote.bind(this)}
                    detectiveInvestigated={this.props.detectiveInvestigated}
                />
            } else {
                return <div className="role">Think about who you want to investigate</div>
            }
        } else {
            return <div className="role">Nothing to do but sleep the night away!</div>
        }
    }
    render() {
        if (this.props.gameTime === 'Day' && !this.props.player.eliminated) {
            return (
                <div className="actions">
                    <div>
                        <Timer countdownStart={this.props.timer} />
                        <div className="role">You are <strong>{this.props.player.role}</strong></div>
                        <PublicVote 
                            players={this.props.players} 
                            submitVote={this.submitVote.bind(this)}
                            publicNominations={this.props.publicNominations}
                            player={this.props.player}
                        />
                    </div>
                </div>
            );
        } else if (this.props.gameTime === null) {
            return (
                <div className="actions">
                    <div className="role">
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
        } else if (this.props.player.eliminated) {
            return ( 
                <div className="actions">
                    <Timer countdownStart={this.props.timer} />
                    <div className="role">You have been eliminated from the game.</div>
                </div>
            );
        } else { 
            return (
                <div className="actions">
                    <Timer key={this.props.timer} countdownStart={this.props.timer} />
                    <div className="role">You are <strong>{this.props.player.role}</strong></div>
                    <div>{this.renderNight()}</div>
                </div>
            );
        }
    }
}

export default ActionsPanel;