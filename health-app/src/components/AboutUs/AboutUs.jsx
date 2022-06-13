import React from 'react';
import './AboutUs.css';
import watch from "../../logos/apple-watch-series-7.webp";
import sensors from "../../logos/sensors.png";
import profile from "../../logos/profile.jpeg";
import users from "../../logos/users.jpeg";
import ChoicesBoxesLoggedIn from "../ChoicesBoxesLoggedIn/ChoicesBoxesLoggedIn";


import { Link } from 'react-router-dom';

class AboutUs extends React.Component {
    render() {
        return (
            <div>
                <div className='page-title'>
                    <b>About us</b>
                </div>
                
                <ChoicesBoxesLoggedIn />

            </div>
        );
    }
}

export default AboutUs;


