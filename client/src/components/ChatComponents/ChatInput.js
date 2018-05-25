import React from "react";

const ChatInput = ({ text, username, handleTextChange, chatLocked }) => (
    <div className='chat-bar'>
        <input type="text" value={text} placeholder={chatLocked ? "Shhh. You're supposed to be asleep!" : "Message"} onChange={handleTextChange} onKeyDown={handleTextChange} disabled={chatLocked} className="chat-bar__input" />
    </div>
);

export default ChatInput;
