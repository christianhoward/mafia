import React, { Component } from 'react';

import Button from './Button';

class DetectiveVote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            investigated: ''
        }
    }
    handleRadioButtons(e) {
        this.setState({ investigated: e.target.value });
    }
    render() {
        return (
            <div>
                {this.props.players.filter(player => player.eliminated === false).map(player => {
                    return (
                        <div key={player.username}>
                            <label>
                                <input 
                                    type="radio" 
                                    name={player.username} 
                                    value={player.username} 
                                    checked={player.username === this.state.investigated}
                                    onChange={this.handleRadioButtons.bind(this)}
                                    disabled={player.eliminated === true || this.props.detectiveInvestigated.find(investigatedPlayer => investigatedPlayer === player.username) === player.username}
                                    
                                />
                                {player.username} {this.props.detectiveInvestigated.find(investigatedPlayer => investigatedPlayer === player.username) === player.username ? `${player.username} is part of the ${player.role}` : null}
                            </label>
                        </div>
                    );
                })}
                <Button value={this.state.investigated} onClick={this.props.submitVote} disabled={null} use='Detective'>Submit</Button>
            </div>
        );
    }
}

export default DetectiveVote;