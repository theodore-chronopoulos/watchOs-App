import React from "react";
import loginImg from "../../logos/100.png";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import "./LoginRegister.scss";
import Swal from 'sweetalert2'


export class AdditionalInfo extends React.Component {
    render() {
        let styleObj2 = { lineHeight: 3 }
        return (
            <div className="LoginRegister">
                <div className="login">
                    <div className="container">
                        <div className="base.container">
                            <div style={styleObj2}>
                                <div className="image">
                                    <img src={loginImg} />
                                </div>
                                <div style={styleObj2} className="form">
                                    <div className="text-login">
                                        <label htmlFor="email"> <b> First Name </b></label>
                                    </div>
                                    <div className="input-login">
                                        <input className="input_field" type="first_name" name="first_name" placeholder="firtst name" id="first_name" />
                                    </div>
                                </div>
                                <div style={styleObj2} className="form">
                                    <div className="text-login">
                                        <label htmlFor="email"> <b>Last Name </b></label>
                                    </div>
                                    <div className="input-login">
                                        <input className="input_field" type="last_name" name="last_name" placeholder="last name" id="last_name" />
                                    </div>
                                </div>
                                <div style={styleObj2} className="form">
                                    <div className="text-login">
                                        <label htmlFor="email"> <b>Address </b></label>
                                    </div>
                                    <div className="input-login">
                                        <input className="input_field" type="address" name="address" placeholder="address" id="address" />
                                    </div>
                                </div>
                                <div style={styleObj2} className="form">
                                    <div className="text-login">
                                        <label htmlFor="password"> <b>City</b></label>
                                    </div>
                                    <div className="input-login">
                                        <input className="input_field" type="city" name="city" placeholder="city" id="city" />
                                    </div>
                                </div>
                                <div style={styleObj2} className="form">
                                    <div className="text-login">
                                        <label htmlFor="password"> <b>Telephone</b></label>
                                    </div>
                                    <div className="input-login">
                                        <input className="input_field" type="telephone" name="telephone" placeholder="telephone" id="telephone" />
                                    </div>
                                </div>
                            </div>
                            <div className="footer">
                                <button type="button" className="btn_teo" onClick={this.handleClick}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleClick() {
        var first_name = document.getElementById("first_name").value;
        var last_name = document.getElementById("last_name").value;
        var address = document.getElementById("address").value;
        var city = document.getElementById("city").value;
        var telephone = document.getElementById("telephone").value;

        if (first_name == null || first_name == "" || last_name == null || last_name == "" ||
            address == null || address == "" || city == null || city == "" || telephone == null || telephone == "") {
            Swal.fire({
                title: 'Incorrect Form',
                text: 'Please complete all the fields.',
                icon: 'info',
                customClass: "swal_ok_button",
                confirmButtonColor: "#2a4cd3"
            })
        }
        else {
            const database = getDatabase();
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    const uid = user.uid;

                    set(ref(database, 'admins/' + uid), {
                        first_name: first_name,
                        last_name: last_name,
                        address: address,
                        city: city,
                        telephone: telephone
                    })
                        .then(() => {
                            // Data saved successfully!
                            Swal.fire({
                                title: 'Success',
                                text: "Registretion is complete!",
                                icon: 'success',
                                customClass: "swal_ok_button",
                                confirmButtonColor: "#2a4cd3"
                            }).then(function () {
                                window.location.href = '/homeadmin';
                                console.log("new admin");
                            });
                        })
                        .catch((error) => {
                            // The write failed...
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            // alert(errorMessage);
                            console.log("fuck");
                            Swal.fire({
                                title: 'Unexpected error',
                                text: 'Please try again.',
                                icon: 'info',
                                customClass: "swal_ok_button",
                                confirmButtonColor: "#2a4cd3"
                            })
                        });
                }
                else {
                    // User is signed out
                    Swal.fire({
                        title: 'Not authenticated',
                        text: 'You have to register first',
                        icon: 'info',
                        customClass: "swal_ok_button",
                        confirmButtonColor: "#2a4cd3"
                    })
                }
            });
        }
    }
}
export default AdditionalInfo;