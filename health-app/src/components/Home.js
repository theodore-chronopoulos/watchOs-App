import React,{ useState} from 'react';
// import '../components/Home/scss/style.scss';
import ChoicesBoxesHome from '../components/ChoicesBoxes/ChoicesHome'
// import { Link } from 'react-router-dom';
import '../App.css';
// import TotalAnalytics from "../components/TotalAnalytics/TotalAnalytics";


class Home extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
        };

    }
    render() {
        return (
            <div>
                <ChoicesBoxesHome/>
                {/* <TotalAnalytics /> */}
            </div>

        );
    }
}


export default Home;