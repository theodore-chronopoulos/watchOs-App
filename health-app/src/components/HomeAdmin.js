import React,{ useState} from 'react';
// import '../components/Home/scss/style.scss';
import ChoicesBoxes from '../components/ChoicesBoxes/Choices'
// import { Link } from 'react-router-dom';
import '../App.css';
// import TotalAnalytics from "../components/TotalAnalytics/TotalAnalytics";


class HomeAdmin extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
        };

    }
    render() {
        return (
            <div>
                <ChoicesBoxes/>
                {/* <TotalAnalytics /> */}
            </div>

        );
    }
}


export default HomeAdmin;