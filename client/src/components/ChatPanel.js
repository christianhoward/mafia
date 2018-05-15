import React, { Component } from 'react';
import axios from 'axios';

import ChatList from './ChatComponents/ChatList';
import ChatInput from './ChatComponents/ChatInput';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
        this.handleTextChange = this.handleTextChange.bind(this);
    }
    handleTextChange(e) {
        if (e.keyCode === 13) {
            const payload = {
                username: this.props.username,
                message: this.state.text,
                timeStamp: new Date().toLocaleDateString(navigator.language, { hour: '2-digit', minute: '2-digit' })
            };
            axios.post('/send-message', payload);
            this.setState({ text: '' });
        } else {
            this.setState({ text: e.target.value });
        }
    }
    render() {
        return (
            <div className="chat">
                <ChatList chats={this.props.chats} />
                <ChatInput
                text={this.state.text}
                username={this.props.username}
                handleTextChange={this.handleTextChange}
                />
            </div>
        );
    }
}

export default Chat;
