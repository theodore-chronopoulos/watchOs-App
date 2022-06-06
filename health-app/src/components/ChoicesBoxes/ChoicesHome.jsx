import React from 'react';
import './scss/style.scss';
import aboutus from "../../logos/aboutus.jpeg";
import statistics from "../../logos/statistics.jpeg";
import { Link } from 'react-router-dom';

class ChoicesHome extends React.Component {
    render() {
        return (
            <section className="choices">
                
                <div className="choice__content container container--nav container--pall">
                <div className="welcome_title">Welcome to <b>MyHealth</b>!</div>
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
                        
                    </div>
                </div>

            </section>
        );
    }
}

export default ChoicesHome;