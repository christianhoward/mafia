import React, { Component } from 'react';
import axios from 'axios';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countdownStatus: 'stopped',
            time: 0
        }
    }
    componentDidMount() {
        this.setState({ time: this.props.countdownStart });
        this.runTimer();
    }
    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = undefined;
    }
    formatTime(time) {
        let seconds = time % 60;
        let minutes = Math.floor(time / 60);
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        return `${minutes}:${seconds}`;
    }
    runTimer() {
        this.setState({ countdownStatus: 'started' });
        this.timer = setInterval(() => {
            let payload;
            if (this.state.time === '' || this.state.time === 0) {
                this.setState({ time: this.props.countdownStart - 1 });
            } else {
                this.setState({ time: this.state.time - 1 });
            }
            if (this.state.time === 0) {
                this.setState({ countdownStatus: 'stopped' });
                clearInterval(this.timer);
                this.timer = undefined;
            }
        }, 1000);
    }
    render() {
        return (
            <div className="clock">
                <span className="clock-text">{this.formatTime((this.state.time === '' || this.state.time === 0 ? this.props.countdownStart : this.state.time))}</span>
            </div>
        );
    }
}
  
export default Timer;