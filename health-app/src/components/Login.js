import React from "react";
import loginImg from "../logos/100.png";
// import { Redirect } from 'react-router-dom';
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
        let styleObj2 = { lineHeight: 3 }
        return (
            <div className="base-container" ref={this.props.containerRef}>

                <div style={styleObj2}>
                    <div className="image">
                        <img src={loginImg} />
                    </div>
                    <div style={styleObj2} className="form">
                        <div className="text-login">
                            <label htmlFor="email"> <b> Email </b></label>
                        </div>
                        <div className="input-login">
                            <input className="input_field" type="text" name="email" id="email" placeholder="email" />
                        </div>
                    </div>
                    <div style={styleObj2} className="form">
                        <div className="text-login">
                            <label htmlFor="password"> <b>Password</b></label>
                        </div>
                        <div className="input-login">
                            <input className="input_field" type="password" name="password" id="password" placeholder="password" />
                        </div>
                    </div>
                </div>
                <div>
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

        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                Swal.fire({
                    title: 'Success',
                    text: "Succesful login!",
                    icon: 'success',
                    customClass: "swal_ok_button",
                    confirmButtonColor: "#2a4cd3"
                }).then(function () {
                    window.location.href = '/home';
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
                    confirmButtonColor: "#2a4cd3"
                })
            });
    }

}