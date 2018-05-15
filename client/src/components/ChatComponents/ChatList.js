import React from "react";

class ChatList extends React.Component {
    componentDidUpdate() {
        const objDiv = document.getElementById('chat-list');
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    render() {
        return (
            <div className="chat-list" id="chat-list">
                {this.props.chats.map(chat => {
                    return (
                        <div className="chat--messages">
                            <div><strong style={ chat.username === 'Admin' ? {color: 'red'} : {color: 'black'} }>{chat.username}</strong> <small style={{ color: 'grey' }}>{chat.timeStamp.substr(chat.timeStamp.length-8)}</small></div>
                            <div>{chat.message}</div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default ChatList;