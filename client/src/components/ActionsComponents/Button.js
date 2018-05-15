import React from "react";

const Button = ({ player, value, submitVote }) => (
  <button value={value} disabled={player.voted} onClick={submitVote}>{value}</button>
);

export default Button;