import React from 'react';

import './scss/style.scss';
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Swal from 'sweetalert2'
import profile_pic from "../../logos/profile-icon2.png";
import ChoicesBoxesLoggedIn from "../ChoicesBoxesLoggedIn/ChoicesBoxesLoggedIn";

class ProfileUser extends React.Component {
    constructor(props) {
        super(props);
        this.up_counter = this.up_counter.bind(this);
        this.down_counter = this.down_counter.bind(this);

        this.state = {
            click: true,
            email: "",
            allow_notifications: "",
            measurement_counter: 0,
            repeat_time: ""
        };
    }
    async componentDidMount() {
        if (this.state === undefined) { return }
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                const dbRef = ref(getDatabase());
                get(child(dbRef, `users/${uid}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        console.log(snapshot.val());
                        this.setState({
                            email: snapshot.val().email,
                            allow_notifications: snapshot.val().allow_notifications,
                            measurement_counter: parseInt(snapshot.val().measurement_counter),
                            repeat_time: snapshot.val().repeat_time
                        })
                    }
                    else {
                        console.log("No data available");
                        window.location.href = '/profile_admin';

                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
            else {
                // User is signed out
                Swal.fire({
                    title: 'Not authenticated',
                    text: 'Please sign in',
                    icon: 'info',
                    customClass: "swal_ok_button",
                    confirmButtonColor: "#2a4cd3"
                }).then(function () {
                    window.location.href = '/';
                    console.log("error here");
                });
            }
        });

    }
    up_counter() {
        var temp = this.state.measurement_counter;
        if (temp < 96) {
            this.setState({
                measurement_counter: temp + 5
            })
        }
    };

    down_counter() {
        var temp = this.state.measurement_counter;
        if (temp > 14) {
            this.setState({
                measurement_counter: temp - 5
            })
        }
    }

    closeMobileMenu = () => this.setState({ click: false });

    render() {
        return (
            <div>
                <section className="hero">
                    <div className="hero__background">
                        <div className="banner"  >
                            <img src={profile_pic} className="myimage" />
                        </div>
                        <div className="hero__title">
                            <h3> Profile Info </h3>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="email">Email: <b>{this.state.email}</b></p>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="allow_notifications">Allow notifications: <b>{this.state.allow_notifications}</b></p>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="measurement_counter">Ammount of measurements: <b>{this.state.measurement_counter}</b></p>
                            <button onClick={this.up_counter}>up</button>
                            <button onClick={this.down_counter}>down</button>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="repeat_time">Repeat notification every: <b>{this.state.repeat_time}</b></p>
                        </div>
                    </div>
                </section>
                {/* <ChoicesBoxesLoggedIn /> */}
            </div>
        );
    }
}

export default ProfileUser;

