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
                <div className="role">You saved <strong>{this.props.doctorSaved ? this.props.doctorSaved.toUpperCase() : 'NO ONE'}</strong> last night. Who would you like to save tonight?</div>
                <div className="role">
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
                </div>
                <div className="button-group">
                    <Button value={this.state.saved} onClick={this.props.submitVote} disabled={null} use='Doctor'>Submit</Button>
                </div>
            </div>
        );
    }
}

export default DoctorVote;