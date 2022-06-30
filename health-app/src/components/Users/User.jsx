import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import "./scss/style.scss";
import { getDatabase, ref, child, get, update } from "firebase/database";
import Swal from "sweetalert2";
import profile_pic from "../../logos/teliko.png";
import ChoicesBoxesBottom from "../ChoicesBoxesBottom/ChoicesBoxesBottom";
import LineChart from "../Charts/LineChart";
import DoughnutChart from "../Charts/DoughnutChart";
import Form from "react-bootstrap/Form";


import watch from '../../logos/watch.png';
import repeat_time_img from '../../logos/repeat_time.png';
import notification from '../../logos/notification.png';
import email_img from '../../logos/email.png';


function User() {

    let location = useLocation();
    console.log(location);

    const user_id = location.state.user_id;
    const email = location.state.email;
    const allow_notifications = location.state.allow_notifications;
    const [measurement_counter, setMesCounter] = useState(location.state.measurement_counter);
    const [repeat_time, setRepeatTime] = useState(location.state.repeat_time);


    const time_options = ["This Month", "Last Measurement"];
    const [selected_type, setSelectedType] = useState("heartRate");
    const [selected_time, setSelectedTime] = useState("");
    const [selected_activity, setSelectedActivity] = useState("");
    const [show, setShow] = useState(false);
    const [aveOxygen, setAveOxygen] = useState(0);
    const [labels, setLabels] = useState([]);
    const [heartRatesData, setHeartRatesData] = useState([]);
    const [oxygenData, setOxygenData] = useState([]);
    const [oxygenlabels, setOxygenlabels] = useState([]);
    const [measurement_types, setMeasurementTypes] = useState([]);
    const [activity_types, setActivityTypes] = useState([]);

    const onDropdownSelectedActivity = (e) => {
        setSelectedActivity(e.target.value);
    }
    const onDropdownSelectedTime = (e) => {
        setSelectedTime(e.target.value);
    }
    const fetch_data = () => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${user_id}/${selected_type}/${selected_activity}`)).then(
            (snapshot) => {
                if (snapshot.exists()) {
                    if (selected_time == "Last Measurement") {
                        var timestamps = []
                        var averages = []
                        var valuesarray = []
                        const index = Object.keys(snapshot.val()).length;
                        const measurement = Object.keys(snapshot.val())[index - 1];
                        get(child(dbRef, `users/${user_id}/${selected_type}/${selected_activity}/${measurement}`)).then(
                            (snapshot) => {
                                var values = Object.values(snapshot.val())
                                var keys = Object.keys(snapshot.val())
                                values.forEach((value, index) => {
                                    valuesarray.push(value)
                                })
                                keys.forEach((value, index) => {
                                    timestamps.push(value)
                                })
                                var average = values.reduce((a, b) => a + b, 0) / values.length;
                                console.log(average)
                                setHeartRatesData(valuesarray);
                                setLabels(timestamps);
                                setAveOxygen(average);
                            }
                        )
                    }
                    if (selected_time == "This Month") {
                        var today = new Date();
                        var current_month = today.getMonth() + 1;
                        console.log(current_month);
                        var timestamps = []
                        var averages = []
                        var valuesarray = []
                        setHeartRatesData([]);
                        setLabels([]);
                        for (let el in snapshot.val()) {
                            console.log(el)
                            var month = parseInt(el[5] + el[6]);
                            if (month == current_month) {
                                get(child(dbRef, `users/${user_id}/${selected_type}/${selected_activity}/${el}`)).then(
                                    (snapshot) => {
                                        let temparray = labels

                                        temparray.push(el)
                                        setLabels(temparray)
                                        var values = Object.values(snapshot.val())
                                        values.forEach((value, index) => {
                                            valuesarray.push(value)
                                        })
                                        var average = values.reduce((a, b) => a + b, 0) / values.length;
                                        averages.push(average);
                                        var average_oxygen = averages.reduce((a, b) => a + b, 0) / averages.length;
                                        console.log(heartRatesData)
                                        setHeartRatesData(averages);
                                        setAveOxygen(average_oxygen);

                                    }
                                )
                            }
                        }
                    }
                    console.log(heartRatesData)
                    console.log(labels)
                }
            }).catch((error) => {
                console.error(error);
            });
    }


    const up_repeat = () => {
        console.log(activity_types)
        console.log(measurement_types)
        if (repeat_time < 24) {
            let temp = repeat_time + 1;
            setRepeatTime(temp)
            const db = getDatabase();
            update(ref(db, "users/" + user_id), {
                repeat_time: temp,
            });
        }
    }
    const down_repeat = () => {
        if (repeat_time > 0) {
            let temp = repeat_time - 1;
            setRepeatTime(temp)
            const db = getDatabase();
            update(ref(db, "users/" + user_id), {
                repeat_time: temp,
            });
        }
    }
    const up_counter = () => {
        if (measurement_counter < 96) {
            let temp = measurement_counter + 5
            setMesCounter(measurement_counter + 5)
            const db = getDatabase();
            update(ref(db, "users/" + user_id), {
                measurement_counter: temp,
            });
        }
    }
    const down_counter = () => {
        if (measurement_counter > 14) {
            let temp = measurement_counter - 5
            setMesCounter(measurement_counter - 5)
            const db = getDatabase();
            update(ref(db, "users/" + user_id), {
                measurement_counter: temp,
            });
        }
    }

    useEffect(() => {

        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${user_id}`))
            .then((snapshot) => {
                let activity_types_temp = []
                let measurement_types_temp = []
                if (snapshot.exists()) {
                    console.log("We are going to test");
                    for (let el in snapshot.val()) {
                        if (el == "heartRate" || el == "oxygen") {
                            measurement_types_temp.push(el);
                        }
                    }
                    console.log(measurement_types_temp)
                    setMeasurementTypes(measurement_types_temp)
                    if (selected_type == "heartRate") {
                        const { heartRate } = snapshot.val();
                        for (let el in heartRate) {
                            activity_types_temp.push(el);
                        }
                        setActivityTypes(activity_types_temp)
                    } else {
                        console.log("NO DATA HEARTEDDDE");
                    }
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);



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
                        <h3> Personal Information </h3>
                    </div>
                    <div className="hero__info">
                        <img src={email_img} className="image_search" alt={email_img} />

                        <p id="email">
                            Email: <b>{email}</b>
                        </p>
                    </div>
                    <div className="hero__info">
                        <img src={notification} className="image_search" alt={notification} />

                        <p id="allow_notifications">
                            Allow notifications:{" "}
                            <b>{allow_notifications.toString()}</b>
                        </p>
                    </div>
                    <div className="hero__info">
                        <img src={watch} className="image_search" alt={watch} />

                        <p id="measurement_counter">
                            Ammount of measurements: <b>{measurement_counter}</b>
                        </p>
                        <button className="up_down_button" onClick={up_counter}>
                            +
                        </button>
                        <button className="up_down_button" onClick={down_counter}>
                            -
                        </button>
                    </div>
                    <div className="hero__info">
                        <img src={repeat_time_img} className="image_search" alt={repeat_time_img} />

                        <p id="repeat_time">
                            Repeat notification every: <b>{repeat_time}</b>
                        </p>
                        <button className="up_down_button" onClick={up_repeat}>
                            +
                        </button>
                        <button className="up_down_button" onClick={down_repeat}>
                            -
                        </button>
                    </div>
                </div>
            </section>
            <div className="dropdowns-div">
                <Form.Select
                    className="measurement-select"
                    onChange={onDropdownSelectedActivity}
                    aria-label="Select activity"
                    label="Select activity"
                    placeholder="Select activity"
                >
                    <option selected disabled> Select activity</option>
                    {activity_types.map(activity_type =>
                        <option
                            key={activity_type}
                            value={activity_type}
                        >
                            {activity_type}
                        </option>
                    )}
                </Form.Select>

                <Form.Select
                    className="measurement-select"
                    onChange={onDropdownSelectedTime}
                    aria-label="Select activity"
                >
                    <option selected disabled> Select time </option>
                    {time_options.map(time_option =>
                        <option
                            key={time_option}
                            value={time_option}
                        >
                            {time_option}
                        </option>
                    )}

                </Form.Select>

                <button
                    className="plot_btn"
                    onClick={fetch_data}
                    placeholder="Plot graph">
                    Plot Graph
                </button>
            </div>
            <div className='plot-title'>
                <b>Heartrate</b>
            </div>
            {(
                heartRatesData &&
                labels && (
                    <main className="ChartContent">
                        <div className="ChartWrapper">
                            <LineChart
                                heartrate={heartRatesData}
                                labels={labels}
                                timestamp={selected_time}
                            />
                        </div>
                    </main>
                ))}
            <div className='plot-title'>
                <b>Oxygen level</b>
            </div>
            {(
                <main className="DoughnutChartContent">
                    <div className="DoughnutChartWrapper">
                        <DoughnutChart
                            oxygen={aveOxygen}
                        // labels={this.state.oxygenlabels}
                        />
                    </div>
                </main>
            )}
            <ChoicesBoxesBottom />
        </div>
    );
}

export default User;




