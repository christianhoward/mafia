import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './Header';
import JoinRooms from './JoinRooms';
import Room from './Room';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            room: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        return (
            <div>
                <BrowserRouter>
                    <div className="app">
                        <Header />
                        <div className="container">
                            <Route exact path="/" render={(props) => <JoinRooms {...this.state} handleChange={this.handleChange} />} />
                            <Route path="/:room" render={(props) => <Room {...this.state} />} />
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;