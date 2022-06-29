import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import profile_pic from "../../logos/profile-icon2.png";
import LineChart from "../Charts/LineChart";
import Form from "react-bootstrap/Form";

import Swal from "sweetalert2";
import { getDatabase, ref, child, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function User() {
    // const [click, setClick] = useState(false);

    // const handleClick = () => setClick(!click);
    // const closeMobileMenu = () => setClick(false);

    let location = useLocation();
    console.log(location);
    // console.log(props)
    let user_id = location.state.user_id;
    console.log(user_id)

    const dbRef = ref(getDatabase());
    const [email, setEmail] = useState("");
    var [measurement_counter, setMeCounter] = useState(0);
    var [repeat_time, setRepeatTime] = useState("");
    const [allow_notifications, setAllowNotifications] = useState("");
    const [selected_type, setSelectedType] = useState("heartRate");
    // var [email, setEmail] = useState("");
    // var [email, setEmail] = useState("");
    // var [email, setEmail] = useState("");

    var labels = []
    var heartRatesData = []
    var oxygenData = []
    var oxygenlabels = []
    var measurement_types = []
    var activity_types = []
    var show = false
    var aveOxygen = 0

    get(child(dbRef, `users/${user_id}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val())

                setEmail(snapshot.val().email)
                setAllowNotifications(snapshot.val().allow_notifications)
                setMeCounter(parseInt(snapshot.val().measurement_counter))
                setRepeatTime(snapshot.val().repeat_time)

                console.log("We are going to test");
                for (let el in snapshot.val()) {
                    if (el == "heartRate" || el == "oxygen") {
                        measurement_types.push(el);
                    }
                }
                if (selected_type == "heartRate") {
                    const { heartRate } = snapshot.val();

                    for (let el in heartRate) {
                        activity_types.push(el);
                        //el for activity type
                        labels = [...Object.keys(heartRate[el])]; //left part for timestamp
                        heartRatesData = [...Object.values(heartRate[el])]; // for values
                    }
                } else {
                    console.log("NO DATA HEARTEDDDE");
                }
            } else {
                console.log("No data available");
                // window.location.href = "/profile_admin";
            }
        })
        .catch((error) => {
            console.error(error);
        });
    console.log(email)


    function up_repeat() {
        // console.log(this.state.id_user)

        var temp = repeat_time;
        if (temp < 24) {
            // setRepeatTime(temp + 1)
            // repeat_time = temp + 1
        }
        const db = getDatabase();
        update(ref(db, "users/" + user_id), {
            repeat_time: repeat_time,
        });
    }

    function down_repeat() {
        var temp = repeat_time;
        if (temp > 0) {
            // setRepeatTime(temp - 1)
        }
        const db = getDatabase();
        update(ref(db, "users/" + user_id), {
            repeat_time: repeat_time,
        });
    }
    function up_counter() {
        var temp = measurement_counter;
        if (temp < 96) {
            measurement_counter = temp + 5
        }
        const db = getDatabase();
        update(ref(db, "users/" + user_id), {
            measurement_counter: measurement_counter,
        });
    }

    function down_counter() {
        var temp = measurement_counter;
        if (temp > 14) {
            measurement_counter = temp - 5
        }
        const db = getDatabase();
        update(ref(db, "users/" + user_id), {
            measurement_counter: measurement_counter,
        });
    }


    // console.log(this.state.id_user)
    return (
        <div>
            <script
                type="text/javascript"
                src="https://code.jquery.com/jquery-1.7.1.min.js"
            ></script>
            <section className="hero">
                <div className="hero__background">
                    <div className="banner">
                        <img src={profile_pic} className="myimage" />
                    </div>
                    <div className="hero__title">
                        <h3> Profile Info </h3>
                    </div>
                    <div className="hero__info">
                        <div className="circle">
                            <div className="circle__one"></div>
                        </div>
                        <p id="email">
                            Email: <b>{email}</b>
                        </p>
                    </div>
                    <div className="hero__info">
                        <div className="circle">
                            <div className="circle__one"></div>
                        </div>
                        <p id="allow_notifications">
                            Allow notifications:{" "}
                            <b>{allow_notifications.toString()}</b>
                        </p>
                        <label className="switch">
                        </label>
                    </div>
                    <div className="hero__info">
                        <div className="circle">
                            <div className="circle__one"></div>
                        </div>
                        <p id="measurement_counter">
                            Ammount of measurements: <b>{measurement_counter}</b>
                        </p>
                        <button className="up_down_button" onClick={up_counter()}>
                            +
                        </button>
                        <button className="up_down_button" onClick={down_counter()}>
                            -
                        </button>
                    </div>
                    <div className="hero__info">
                        <div className="circle">
                            <div className="circle__one"></div>
                        </div>
                        <p id="repeat_time">
                            Repeat notification every: <b>{repeat_time}</b>
                        </p>
                        <button className="up_down_button" onClick={up_repeat()}>
                            +
                        </button>
                        <button className="up_down_button" onClick={down_repeat()}>
                            -
                        </button>
                    </div>
                </div>
            </section>
            {/*<div className="dropdowns-div">
                <Form.Select
                    className="measurement-select"
                    onChange={this.onDropdownSelected}
                    aria-label="Default select example"
                >
                    {this.createSelectItems()}
                </Form.Select>

                <Form.Select
                    className="measurement-select"
                    onChange={this.createSelectItemsActivities}
                    aria-label="Default select example"
                >
                    {this.createSelectItemsActivities()}
                </Form.Select>
            </div>

            {(selected_type == "heartRate" &&
                heartRatesData &&
                labels && (
                    <main className="ChartContent">
                        <div className="ChartWrapper">
                            <LineChart
                                heartrate={heartRatesData}
                                labels={labels}
                            />
                        </div>
                    </main>
                )) || (
                    <main className="ChartContent">
                        <div className="ChartWrapper">
                            <LineChart
                                heartrate={oxygenData}
                                labels={oxygenlabels}
                            />
                        </div>
                    </main>
                )} */}
        </div>
    );
}
export default User;