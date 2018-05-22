import React, { Component } from 'react';

import Button from './Button';

class DoctorVote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saved: ''
        }
    }
    handleRadioButtons(e) {
        this.setState({ saved: e.target.value });
    }
    render() {
        return (
            <div>
                <div>You saved <strong>{this.props.doctorSaved ? this.props.doctorSaved.toUpperCase() : 'NO ONE'}</strong> last night. Whou would you like to save tonight?</div>
                {this.props.players.filter(player => player.eliminated === false).map(player => {
                    return (
                        <div key={player.username}>
                            <label>
                                <input 
                                    type="radio" 
                                    name={player.username} 
                                    value={player.username} 
                                    checked={player.username === this.state.saved}
                                    onChange={this.handleRadioButtons.bind(this)}
                                    disabled={this.props.doctorSaved === player.username}
                                    
                                />
                                {player.username}
                            </label>
                        </div>
                    );
                })}
                <Button value={this.state.saved} onClick={this.props.submitVote} disabled={null} use='Doctor'>Submit</Button>
            </div>
        );
    }
}

export default DoctorVote;