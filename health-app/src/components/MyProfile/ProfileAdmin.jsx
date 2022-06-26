import React from 'react';

import './scss/style.scss';
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Swal from 'sweetalert2'
import profile_pic from "../../logos/teliko.png";
import ChoicesBoxesLoggedIn from "../ChoicesBoxesLoggedIn/ChoicesBoxesLoggedIn";

import address from '../../logos/address.png';
import telephone from '../../logos/telephone.png';
import doctor from '../../logos/doctor.png';
import total_users from '../../logos/total_users.png';
import email from '../../logos/email.png';


class ProfileAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            click: true,
            first_name: "",
            last_name: "",
            address: "",
            city: "",
            telephone: "",
            email: "",
            total_users: ""
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
                            address: snapshot.val().address,
                            email: snapshot.val().email,
                            total_users: snapshot.val().total_users
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
                    confirmButtonColor: "#6a98ce"
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
                        <img src={doctor} className="image_search" alt={doctor} />
                        <p id="first_name">Name: <b>{this.state.first_name} {this.state.last_name}</b></p>
                    </div>

                    <div className="hero__info">
                        <img src={address} className="image_search" alt={address} />
                        <p id="address">Address: <b>{this.state.address}, {this.state.city}</b></p>
                    </div>

                    <div className="hero__info">
                        <img src={telephone} className="image_search" alt={telephone} />
                        <p id="telephone">Telephone: <b>{this.state.telephone}</b></p>
                    </div>

                    <div className="hero__info">
                    <img src={email} className="image_search" alt={email} />
                        <p id="email">Email: <b>{this.state.email}</b></p>
                    </div>

                    <div className="hero__info">
                    <img src={total_users} className="image_search" alt={total_users} />
                        <p id="total_users">Total users: <b>{this.state.total_users}</b></p>
                    </div>
                </div>
            </section >
            {/* <ChoicesBoxesLoggedIn /> */}
        </div >
    );
}
}

export default ProfileAdmin;

