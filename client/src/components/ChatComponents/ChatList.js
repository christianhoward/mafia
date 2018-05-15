import React from "react";

class ChatList extends React.Component {
    componentDidUpdate() {
        const objDiv = document.getElementById('chat-list');
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    renderDate() {
        const date = new Date().toLocaleDateString(navigator.language, { hour: '2-digit', minute: '2-digit' });
        return <small style={{ color: 'grey' }}>{date.substr(date.length-8)}</small>;
    }
    render() {
        return (
            <div className="chat-list" id="chat-list">
                {this.props.chats.map(chat => {
                    return (
                        <div className="chat--messages">
                            <div><strong style={ chat.username === 'Admin' ? {color: 'red'} : {color: 'black'} }>{chat.username}</strong> {this.renderDate()}</div>
                            <div>{chat.message}</div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default ChatList;