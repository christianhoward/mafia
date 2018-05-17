import React, { Component } from 'react';
import axios from 'axios';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countdownStatus: 'stopped'
        }
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
            if (this.props.time === '') {
                payload = {
                    time: this.props.countdownStart - 1
                };
            } else {
                payload = {
                    time: this.props.time - 1
                };
            }
            axios.post('/set-timer', payload);
            if (payload.time === 0) {
                this.setState({ countdownStatus: 'stopped' });
                clearInterval(this.timer);
            }
        }, 1000);
    }
    render() {
        return (
            <div>
                <div className="clock">
                    <span className="clock-text">{this.formatTime((this.props.time === '' ? this.props.countdownStart : this.props.time))}</span>
                </div>
                <button onClick={this.runTimer.bind(this)}>Start Timer</button>
            </div>
        );
    }
}
  
export default Timer;