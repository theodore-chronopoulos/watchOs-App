import React from 'react';
import './scss/style.scss';
import aboutus from "../../logos/aboutus.jpeg";
import statistics from "../../logos/statistics.jpeg";
import profile from "../../logos/profile.jpeg";
import users from "../../logos/users.jpeg";


import { Link } from 'react-router-dom';

class ChoicesBoxesUser extends React.Component {
    render() {
        return (
            <section className="choices">
                
                <div className="choice__content container container--nav container--pall">
                <div className="welcome_title">Welcome to <b>MyHealth</b> user page!</div>
                    <div className="choice__grid">
                        
                        <a href="#" className="choice__item">
                        <Link to='/aboutus'>
                            <div className="choice__image"
                                 style={{backgroundImage: `url(${aboutus})`}}>
                            </div>

                            <div className="choice__text">
                                <div className="choice__title">
                                    About us
                                </div>
                                <div className="choice__description">
                                    Learn about our application in
                                    the new Apple Watch Series 7, 
                                    the importance of the measurements,
                                    as well as our goal as a team.
                                </div>
                            </div>
                        </Link>
                        </a>
                        
                        <a href="#" className="choice__item">
                        <Link to='/timesearch'>
                            <div className="choice__image"
                                 style={{backgroundImage: `url(${statistics})`}}>
                            </div>

                            <div className="choice__text">
                                <div className="choice__title">
                                    Statistics
                                </div>
                                <div className="choice__description">
                                    View general statistics about 
                                    oxygen saturation and heart rate 
                                    depending on gender, age etc.
                                </div>
                            </div>
                            </Link>
                        </a>
    
                        <a href="#" className="choice__item">
                        <Link to='/users'>
                            <div className="choice__image"
                                 style={{backgroundImage: `url(${users})`}}>
                            </div>

                            <div className="choice__text">
                                <div className="choice__title">
                                    Admins
                                </div>
                                <div className="choice__description">
                                    Search-Add your admin. Authorize him 
                                    to change your measurement settings
                                    and send you push-notifications. 
                                    View his contact information.
                                </div>
                            </div>
                            </Link>
                        </a>   
                        
                        <a href="#" className="choice__item">
                        <Link to='/profile_user'>
                            <div className="choice__image"
                                 style={{backgroundImage: `url(${profile})`}}>
                            </div>

                            <div className="choice__text">
                                <div className="choice__title">
                                    Profile
                                </div>
                                <div className="choice__description">
                                    Change your personal information,
                                    permissions, contact details and also
                                    view your last measurements.
                                </div>
                            </div>
                            </Link>
                        </a>
                        
                    </div>
                </div>

            </section>
        );
    }
}

export default ChoicesBoxesUser;