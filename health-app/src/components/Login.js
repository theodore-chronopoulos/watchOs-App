import React from "react";
import loginImg from "../logos/100.png";
import { Redirect } from 'react-router-dom';
import Swal from 'sweetalert2'
import getCookie from '../functions/getCookie.js'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


export class Login extends React.Component {


    componentDidMount() {
    }

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.state = {
            email: "",
            password: ""
        };
    }

    render() {
        let styleObj = { fontSize: 28 }
        let styleObj2 = { lineHeight: 2 }
        return (
            <div className="base.container" ref={this.props.containerRef}>

                <div className="content">
                    <div className="image">
                        <img src={loginImg} />
                    </div>
                    <div className="form" style={styleObj2}>
                        <div className="form-group">
                            <label htmlFor="email"> <b> Email </b></label>
                            <input className="input_field" type="text" name="email" id="email" placeholder="email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"> <b>Password</b></label>
                            <input className="input_field" type="password" name="password" id="password" placeholder="password" />
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <button type="button" className="btn_teo" onClick={this.handleLogin}>
                        Login
                    </button>
                </div>

            </div>
        );
    }

    handleLogin() {
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;

        // const firebaseConfig = {
        //     apiKey: "AIzaSyC-bLTaNmbxcjoq2WtVw1J0dOcLxs-N4Kk",
        //     authDomain: "healthwatchapp-e636f.firebaseapp.com",
        // };

        const auth = getAuth();
        // // As httpOnly cookies are to be used, do not persist any state client side.
        // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                Swal.fire({
                    title: 'Success',
                    text: "result.msg",
                    icon: 'success',
                    customClass: "swal_ok_button",
                    confirmButtonColor: "#242424"
                }).then(function () {
                    window.location.href = '/';

                    // // Get the user's ID token as it is needed to exchange for a session cookie.
                    // return user.getIdToken().then(idToken => {
                    //     // Session login endpoint is queried and the session cookie is set.
                    //     // CSRF protection should be taken into account.
                    //     // ...
                    //     const csrfToken = getCookie('csrfToken')
                    //     console.log("User ID Token: " + idToken);
                    //     console.log("Csrf ID Token: " + csrfToken);
                    //     // document.cookie = "charge_evolution_token=" + result.token;
                    //     // window.location.href = '/';
                    //     return postIdTokenToSessionLogin('/sessionLogin', idToken);
                    // });
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    customClass: "swal_ok_button",
                    confirmButtonColor: "#242424"
                })
            });
    }

}