import React from 'react';
import search from '../../logos/search-icon2.png';
import Swal from "sweetalert2";
import { getDatabase, ref, child, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";


class User extends React.Component {
    constructor(props) {
        super(props);
        // this.changeState = this.changeState.bind(this);
        this.state = {
            click: true,
            admin: "",
            searchword: "",
            users: [],
            data: true
        };
    }
    async componentDidMount() {
        const dbRef = ref(getDatabase());
        console.log("fuck")
        // change the next Element
        get(child(dbRef, `users/${this.props.user_id}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot)
                    this.state.id_user = this.props.user_id;
                    // change the last Element
                    this.setState({
                        email: snapshot.val().email,
                        measurement_counter: parseInt(snapshot.val().measurement_counter),
                        repeat_time: snapshot.val().repeat_time,
                        allow_notifications: snapshot.val().allow_notifications,
                        id_user: this.props.user_id
                    });
                    console.log("We are going to test");
                    for (let el in snapshot.val()) {
                        if (el == "heartRate" || el == "oxygen") {
                            this.state.measurement_types.push(el);
                        }
                    }
                    if (this.state.selected_type == "heartRate") {
                        const { heartRate } = snapshot.val();

                        for (let el in heartRate) {
                            this.state.activity_types.push(el);
                            //el for activity type
                            this.state.labels = [...Object.keys(heartRate[el])]; //left part for timestamp
                            this.state.heartRatesData = [...Object.values(heartRate[el])]; // for values
                        }
                    } else {
                        console.log("NO DATA HEARTEDDDE");
                    }
                } else {
                    console.log("No data available");
                    // window.location.href = "/profile_admin";
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    render() {
        return (
            <div>aaa</div>
        )
    }
}

export default User;