import React,{ useState} from 'react';
// import '../components/Home/scss/style.scss';
import ChoicesBoxesUser from '../components/ChoicesBoxes/ChoicesBoxesUser'
// import { Link } from 'react-router-dom';
import '../App.css';
// import TotalAnalytics from "../components/TotalAnalytics/TotalAnalytics";


class HomeUser extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
        };

    }
    render() {
        return (
            <div>
                <ChoicesBoxesUser/>
            </div>
        );
    }
}


export default HomeUser;