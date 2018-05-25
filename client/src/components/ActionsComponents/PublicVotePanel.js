import React, { Component } from 'react';

import PublicFate from './PublicFate';
import PublicNomination from './PublicNomination';
import PublicNominationVote from './PublicNominationVote';
import PublicSeconded from './PublicSeconded';

class PublicVotePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accusation: '',
            nominator: '',
            seconded: '',
            fate: []
        }
        this.handleVote=this.handleVote.bind(this);
    }
    handleVote(type, e) {
        if (type === 'accusation') {
            this.setState({ accusation: e.target.innerHTML, nominator: this.props.player.username });
        } else if (type === 'seconded') {
            this.setState({ seconded: e.target.innerHTML });
        } else {
            this.setState({ fate: [...this.state.fate, { username: e.target.value, vote: e.target.innerHTML }] });
        }
    }
    render() {
        if (this.props.publicNominations.length > 0 && this.props.publicNominations[0].seconded) {
            return <PublicFate 
                nominations={this.props.publicNominations}
                fate={this.state.fate}
                handleVote={this.handleVote}
                submitVote={this.props.submitVote}
            />
        }
        if (this.props.publicNominations.length > 0) {
            return <PublicSeconded 
                seconded={this.state.seconded} 
                submitVote={this.props.submitVote}
                nominations={this.props.publicNominations}
                handleVote={this.handleVote}
                username={this.props.player.username}
                nominator={this.state.nominator}
            />
        }
        if (this.state.accusation === 'Yes') {
            return <PublicNominationVote 
                players={this.props.players} 
                submitVote={this.props.submitVote}
                username={this.props.player.username}
            />
        } else {
            return <PublicNomination 
                accusation={this.state.accusation} 
                handleVote={this.handleVote} 
            />
        }
    }
}

export default PublicVotePanel;