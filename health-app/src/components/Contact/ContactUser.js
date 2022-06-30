
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './contact.scss';


import Swal from 'sweetalert2'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getDatabase, ref, child, get, update } from "firebase/database";
import ChoicesBoxesBottom from "../ChoicesBoxesBottom/ChoicesBoxesBottom";

import emailjs from '@emailjs/browser';


function ContactUser() {
    const form = useRef();

    let location = useLocation();
    console.log(location);
    const user_email = location.state.user_email;
    const admin_id = location.state.admin_id;

    const dbRef = ref(getDatabase());

    const [admin_email, setEmail] = useState("");
    const [admin_first_name, setFirstName] = useState("");
    const [admin_last_name, setLastName] = useState("");


    get(child(dbRef, `admins/${admin_id}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val())

                setEmail(snapshot.val().email)
                setFirstName(snapshot.val().first_name)
                setLastName(snapshot.val().last_name)

            } else {
                console.log("No admin");
                window.location.href = "/";
            }
        })
        .catch((error) => {
            console.error(error);
            window.location.href = "/";
        });
    console.log(admin_email)

    const admin_name = admin_first_name + " " + admin_last_name


    const sendEmail = (e) => {
        e.preventDefault();

        var subject = document.getElementById("subject").value;
        var message = document.getElementById("message").value;
        // var address = document.getElementById("address").value;

        if (subject == null || subject == "" || message == null || message == "") {
            Swal.fire({
                title: 'Incorrect Form',
                text: 'Please complete all the fields.',
                icon: 'info',
                customClass: "swal_ok_button",
                confirmButtonColor: "#6a98ce"
            })
        }

        else {

            const serviceID = "service_zwvhrk9";
            const templateID = "template_h7rd71n";
            const publicKey = "0aTYBDsvVzReKIY0o"

            emailjs.sendForm(serviceID, templateID, form.current, publicKey)
                .then((result) => {
                    console.log("SUCCESS!", result.status, result.text);
                    Swal.fire({
                        title: 'Success',
                        text: "You have succesfully send a message!",
                        icon: 'success',
                        customClass: "swal_ok_button",
                        confirmButtonColor: "#6a98ce"
                    }).then(function () {
                        window.location.href = '/';
                    });
                }, (error) => {
                    console.log(error.text);
                    console.log("FAILED...", error);
                    Swal.fire({
                        title: 'Unexpected error',
                        text: 'Please try again.',
                        icon: 'info',
                        customClass: "swal_ok_button",
                        confirmButtonColor: "#6a98ce"
                    })
                });
        }
    };

    return (
        <div>
            <div className='page-title-form'>
                <b>Contact user</b>
            </div>
            <div className='sectionform'>
                <form ref={form}>
                    <div className='elementform'>
                        <div className='section_title_form'>
                            <label>Send To</label>

                        </div>
                        <div className='contactinput'>
                            <input type="text" id="user_email" name="user_email"
                                className='contactinput' readonly="readonly" value={user_email} />
                        </div>

                    </div>

                    <div className='elementform'>
                        <div className='section_title_form'>
                            <label>Reply to</label>

                        </div>
                        <div className='contactinput'>
                            <input type="text" id="admin_email" name="admin_email"
                                className='contactinput' readonly="readonly" value={admin_email} />
                        </div>


                    </div>

                    <div className='elementform'>
                        <div className='section_title_form'>
                            <label>Name</label>
                        </div>
                        <div className='contactinput'>
                            <input type="text" id="admin_name" name="admin_name"
                                className='contactinput' readonly="readonly" value={admin_name} />
                        </div>


                    </div>

                    <div className='elementform'>
                        <div className='section_title_form'>
                            <label>Subject</label>
                        </div>
                        <div className='contactinput'>
                            <input className='contactinput' type="text" id="subject" name="subject" placeholder='Enter a subject' />
                        </div>


                    </div>

                    <div className='elementform'>
                        <div className='section_title_form'>
                            <label>Message</label>
                        </div>
                        <div className='contactinputtext'>
                            <textarea id="message" name="message" className='contacttext' placeholder='Write your message here' />
                        </div>


                    </div>

                    <button type="submit" className="btn_teo3form" onClick={sendEmail}>Send Email</button>

                </form>
            </div>

            <ChoicesBoxesBottom />
        </div>

    );
};

export default ContactUser;

