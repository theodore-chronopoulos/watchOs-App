import React from 'react';

import './scss/style.scss';
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Swal from 'sweetalert2'
import profile_pic from "../../logos/profile-icon2.png";
import ChoicesBoxesLoggedIn from "../ChoicesBoxesLoggedIn/ChoicesBoxesLoggedIn";

class ProfileAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            click: true,
            first_name: "",
            last_name: "",
            address: "",
            city: "",
            telephone: ""
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
                get(child(dbRef, `admins/${uid}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        console.log(snapshot.val());
                        this.setState({
                            first_name: snapshot.val().first_name,
                            last_name: snapshot.val().last_name,
                            city: snapshot.val().city,
                            telephone: snapshot.val().telephone,
                            address: snapshot.val().address
                        })
                    }
                    else {
                        console.log("No data available");
                        window.location.href = '/profile_user';

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
                            <p id="first_name">First name: <b>{this.state.first_name}</b></p>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="last_name">Last name: <b>{this.state.last_name}</b></p>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="address">Address: <b>{this.state.address}</b></p>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="city">City: <b>{this.state.city}</b></p>
                        </div>

                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="telephone">Telephone: <b>{this.state.telephone}</b></p>
                        </div>

                    </div>
                </section>
                {/* <ChoicesBoxesLoggedIn /> */}
            </div>
        );
    }
}

export default ProfileAdmin;

