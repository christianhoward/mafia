import React, { Component } from 'react';

import Button from './Button';

class PublicVote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            publicVote: ''
        }
    }
    handleRadioButtons(e) {
        this.setState({ publicVote: e.target.value });
    }
    render() {
        return (
            <div>
                <div className="role">Who would you like to nominate?</div>
                <div className="role">
                    {this.props.players.filter(player => player.eliminated === false && player.username !== this.props.username).map(player => {
                        return (
                            <div key={player.username}>
                                <label>
                                    <input 
                                        type="radio" 
                                        name={player.username} 
                                        value={player.username} 
                                        checked={player.username === this.state.publicVote}
                                        onChange={this.handleRadioButtons.bind(this)}
                                        disabled={null}
                                        
                                    />
                                    {player.username}
                                </label>
                            </div>
                        );
                    })}
                </div>
                <div className="button-group">
                    <Button value={this.state.publicVote} onClick={this.props.submitVote} disabled={null} use='Public-Nomination' className="button-group__button">Submit</Button>
                </div>
            </div>
        );
    }
}

export default PublicVote;