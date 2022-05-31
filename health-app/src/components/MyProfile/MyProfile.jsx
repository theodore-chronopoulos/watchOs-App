import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Swal from 'sweetalert2'




class MyProfile extends React.Component {
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
        if(this.state === undefined) {return}
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                const db = getDatabase();
                const query = ref(db, 'admins/' + uid);
                const dbRef = ref(getDatabase());
                // query.once("value").then(function (snapshot) {
                // onValue(query, (snapshot) => {
                //     snapshot.forEach(function (childSnapshot) {
                //         this.state.first_name = childSnapshot.val().first_name;
                //         this.state.last_name = childSnapshot.val().last_name;
                //         this.state.address = childSnapshot.val().address;
                //         this.state.city = childSnapshot.val().city;
                //         this.state.telephone = childSnapshot.val().telephone;
                //         console.log("all good");
                //     });
                // });
                get(child(dbRef, `admins/${uid}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                      console.log(snapshot.val());
                      snapshot.forEach(function (childSnapshot) {
                    //     this.setState({
                    //     first_name: childSnapshot.val().first_name
                    //     // this.state.last_name: childSnapshot.val().last_name;
                    //     // this.state.address = childSnapshot.val().address;
                    //     // this.state.city = childSnapshot.val().city;
                    //     // this.state.telephone = childSnapshot.val().telephone;
                    // })

                        console.log("all good");
                        
                    });
                    } 
                    else {
                      console.log("No data available");
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

        // onValue(starCountRef, (snapshot) => {
        //     const data = snapshot.val();
        //     updateStarCount(postElement, data);
        // });

    }




    closeMobileMenu = () => this.setState({ click: false });

    render() {
        return (
            <div>
                {/* <b>hello</b>
            </div> */}

                <section className="hero">
                    <div className="hero__background">
                        <div className="hero__title">
                            <div className="bullet">
                                <div className="bullet__one">

                                </div>
                            </div>
                            <h3> Profile Info </h3>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="username">Username: {this.state.first_name}</p>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="email">Email: {this.state.last_name}</p>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="num_of_questions">Number of Questions: {this.state.address}</p>
                        </div>

                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="name">Number of Answers: {this.state.telephone}</p>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="address">Upvotes Given: {this.state.city}</p>
                        </div>
                        <div className="hero__info">
                            <div className="circle">
                                <div className="circle__one">

                                </div>
                            </div>
                            <p id="address">Upvotes Received: {this.state.last_name}</p>
                        </div>
                    </div>
                </section>
                {/* <ChoicesBoxesLoggedIn /> */}

            </div>
        );

    }
}

export default MyProfile;