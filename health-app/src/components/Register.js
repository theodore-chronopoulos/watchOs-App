import React from "react";
import loginImg from "../logos/100.png";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export class Register extends React.Component {
    render() {
        let styleObj2 = { lineHeight: 3 }
        return (
            <div className="base.container">
                <div style={styleObj2}>
                    <div className="image">
                        <img src={loginImg} />
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
                </div>
                <div className="footer">
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
        // var first_name = document.getElementById("first_name").value; 

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // document.cookie = "charge_evolution_token=" + result.token;
                window.location.href = '/home';
                console.log("new user");
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
                console.log("fuck");
                // ..
            });
    }
}