import React from "react";
import loginImg from "../logos/100.png";
import Swal from 'sweetalert2'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export class Register extends React.Component {
    render() {
        let styleObj2 = { lineHeight: 3 }
        return (
            <div className="base.container">
                <div style={styleObj2}>
                    <div className="image">
                        <img src={loginImg} className="cyrclethat" />
                    </div>
                    <div style={styleObj2} className="form">
                        <div className="text-login">
                            <label htmlFor="email"> <b> Email </b></label>
                        </div>
                        <div className="input-login">
                            <input className="input_field" type="email" name="email" placeholder="email" id="email" />
                        </div>
                    </div>
                    <div style={styleObj2} className="form">
                        <div className="text-login">
                            <label htmlFor="password"> <b>Password</b></label>
                        </div>
                        <div className="input-login">
                            <input className="input_field" type="password" name="password" placeholder="password" id="password" />
                        </div>
                    </div>
                    <div style={styleObj2} className="form">
                        <div className="text-login">
                            <label for="cars"><b>Register as</b></label>
                        </div>
                        <div className="input-login">
                            <select className="input_field2" id="role">
                                <option value="user">User</option>
                                <option value="admin">Professional</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div>
                    <button type="button" className="btn_teo" onClick={this.handleRegister}>
                        Register
                    </button>
                </div>
            </div>
        );
    }

    handleRegister() {
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        var role = document.getElementById("role").value; 
        // var first_name = document.getElementById("first_name").value; 

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                Swal.fire({
                    title: 'Success',
                    text: "Succesful register!",
                    icon: 'success',
                    customClass: "swal_ok_button",
                    confirmButtonColor: "#6a98ce"
                }).then(function () {
                    if (role == "admin") {
                        window.location.href = '/additionalinfo';
                        console.log("new amdin");
                    }
                    else {
                        // window.location.href = '/homeuser';
                        window.location.href = '/';

                        console.log("new user");
                    }
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // alert(errorMessage);
                console.log("fuck");
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    customClass: "swal_ok_button",
                    confirmButtonColor: "#6a98ce"
                })
            });
    }
}