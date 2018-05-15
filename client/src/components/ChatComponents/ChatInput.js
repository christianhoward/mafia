import React from "react";

const ChatInput = ({ text, username, handleTextChange }) => (
    <div className="chat-bar">
        <input type="text" value={text} placeholder="Message" onChange={handleTextChange} onKeyDown={handleTextChange} className="chat-bar__input" />
    </div>
);

export default ChatInput;
