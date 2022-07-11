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
    const [selected_custom_activity, setSelectedCustomActivity] = useState("");
    const [selected_custom_date, setSelectedCustomDate] = useState("");
    const [custom_data, setCustomData] = useState([]);
    const [custom_labels, setCustomLabels] = useState([]);
    const [custom_aveOxygen, setCustomAveOxygen] = useState(0);
    const [selected_time_ox, setSelectedTimeOx] = useState("");
    const [aveOxygen_custom, setAveOxygenCustom] = useState(0.5);
    const [selected_custom_date_ox, setSelectedCustomDateOx] = useState("");
    const [dates_dropdown, setDatesDropdown] = useState([]);
    const [dates_dropdown_ox, setDatesDropdownOx] = useState([]);
    const [selected_custom_date_hrv, setSelectedCustomDateHrv] = useState("");
    const [hrv_custom, setHrvCustom] = useState(0.5);
    const [dates_dropdown_hrv, setDatesDropdownHrv] = useState([]);

    const onDropdownSelectedActivity = (e) => {
        setSelectedActivity(e.target.value);
    }
    const onDropdownSelectedTime = (e) => {
        setSelectedTime(e.target.value);
    }
    const onDropdownSelectedDateCustomHrv = (e) => {
        setSelectedCustomDateHrv(e.target.value);
    }
    const onDropdownSelectedTimeOx = (e) => {
        setSelectedTimeOx(e.target.value);
    }
    const onDropdownSelectedDateCustomOx = (e) => {
        setSelectedCustomDateOx(e.target.value);
    }
    const onDropdownSelectedDateCustom = (e) => {
        setSelectedCustomDate(e.target.value);
    }
    const onDropdownSelectedActivityCustom = (e) => {
        setSelectedCustomActivity(e.target.value);
        // console.log(e)
        // console.log(selected_custom_activity)
        const dbRef = ref(getDatabase());
        var datesarray = [];
        get(
            child(
                dbRef,
                `users/${user_id}/${selected_type}/${e.target.value}`
            )
        ).then((snapshot) => {
            var values = Object.keys(snapshot.val());
            values.forEach((keys, index) => {
                datesarray.push(keys);
            });
            console.log(datesarray)
            setDatesDropdown(datesarray);
        });
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
                                        console.log(heartRatesData)
                                        setHeartRatesData(averages);
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
    const fetch_custom_data = () => {
        const dbRef = ref(getDatabase());
        get(
            child(
                dbRef,
                `users/${user_id}/heartRate/${selected_custom_activity}/${selected_custom_date}`
            )
        ).then((snapshot) => {
            if (snapshot.exists()) {
                var timestamps = [];
                var valuesarray = [];
                var values = Object.values(snapshot.val());
                var keys = Object.keys(snapshot.val());
                values.forEach((value, index) => {
                    valuesarray.push(value);
                });
                keys.forEach((value, index) => {
                    timestamps.push(value);
                });
                var average = values.reduce((a, b) => a + b, 0) / values.length;
                console.log(average);
                setCustomData(valuesarray);
                setCustomLabels(timestamps);
                setCustomAveOxygen(average);
                // this.setState({ custom_data: valuesarray });
                // this.setState({ custom_labels: timestamps });
                // this.setState({ custom_aveOxygen: average });
            }
        });
    }

    const fetch_data_ox = () => {
        const dbRef = ref(getDatabase());
        if (selected_time_ox == "Last Measurement") {
            get(child(dbRef, `users/${user_id}/oxygen/`)).then(
                (snapshot) => {
                    const index = Object.keys(snapshot.val()).length;
                    const measurement = Object.keys(snapshot.val())[index - 1];
                    get(
                        child(dbRef, `users/${user_id}/oxygen/${measurement}`)
                    ).then((snapshot) => {
                        console.log(snapshot.val());
                        setAveOxygen(Object.values(snapshot.val()))
                        // this.setState({ aveOxygen: Object.values(snapshot.val()) });
                        console.log(aveOxygen);
                    });
                }
            );
        }
        if (selected_time_ox == "This Month") {
            var today = new Date();
            var current_month = today.getMonth() + 1;
            get(child(dbRef, `users/${user_id}/oxygen/`)).then(
                (snapshot) => {
                    var oxygenmonthdata = [];
                    for (let el in snapshot.val()) {
                        var month = parseInt(el[5] + el[6]);
                        if (month == current_month) {
                            get(
                                child(dbRef, `users/${user_id}/oxygen/${el}`)
                            ).then((snapshot) => {
                                var temp = Object.values(snapshot.val());
                                oxygenmonthdata.push(temp[0]);
                                var average =
                                    oxygenmonthdata.reduce((a, b) => a + b, 0) /
                                    oxygenmonthdata.length;
                                setAveOxygen(average);
                                // this.setState({ aveOxygen: average });
                            });
                        }
                    }
                }
            );
        }
    }
    const fetch_custom_data_ox = () => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${user_id}/oxygen/${selected_custom_date_ox}`)).then(
            (snapshot) => {
                setAveOxygenCustom(Object.values(snapshot.val()))
                // this.setState({aveOxygen_custom: Object.values(snapshot.val())})
            })
    }
    const fetch_custom_data_hrv = () => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${user_id}/hrv/${selected_custom_date_hrv}`)).then(
            (snapshot) => {
                setHrvCustom(Object.values(snapshot.val()))
            })
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
        var datesarray = [];

        get(child(dbRef, `users/${user_id}/oxygen/`))
            .then((snapshot) => {
                var keys = Object.keys(snapshot.val())
                keys.forEach((keys, index) => {
                    datesarray.push(keys);
                });
                setDatesDropdownOx(datesarray);
            })

        var datesarray2 = [];
        get(child(dbRef, `users/${user_id}/hrv/`))
            .then((snapshot) => {
                console.log(snapshot.val())
                var keys = Object.keys(snapshot.val())
                // console.log(keys)
                keys.forEach((keys, index) => {
                    datesarray2.push(keys);
                });
                // console.log(datesarray)

                setDatesDropdownHrv(datesarray2)
            }
            )
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
            <div className="plot-title">
                <b>Heartrate</b>
            </div>
            <div className="pinakas">
                <div className="stili">
                    <div className="plot-title3">
                        <b>Statistics</b>
                    </div>
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
                </div>
                <div className="stili">
                    <div className="plot-title3">
                        <b>Measurements</b>
                    </div>
                    <div className="dropdowns-div">
                        <Form.Select
                            className="measurement-select"
                            onChange={onDropdownSelectedActivityCustom}
                            aria-label="Select activity"
                            label="Select activity"
                            placeholder="Select activity"
                        >
                            <option selected disabled>
                                {" "}
                                Select activity
                            </option>
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
                            aria-label="Select Date"
                            onChange={onDropdownSelectedDateCustom}
                        >
                            <option selected disabled>
                                {" "}
                                Select Date{" "}
                            </option>
                            {dates_dropdown.map(date_dropdown =>
                                <option
                                    key={date_dropdown}
                                    value={date_dropdown}
                                >
                                    {date_dropdown}
                                </option>
                            )}

                        </Form.Select>

                        <button
                            className="plot_btn"
                            onClick={fetch_custom_data}
                            placeholder="Plot graph"
                        >
                            Plot Graph
                        </button>
                    </div>
                    {heartRatesData && labels && (
                        <main className="ChartContent">
                            <div className="ChartWrapper">
                                <LineChart
                                    heartrate={custom_data}
                                    labels={custom_labels}
                                    timestamp={selected_time}
                                />
                            </div>
                        </main>
                    )}
                </div>
            </div>
            <div className="plot-title">
                <b>Oxygen level</b>
            </div>
            <div className="pinakas">
                <div className="stili">

                    <div className="plot-title3">
                        <b>Statistics</b>
                    </div>
                    <div className="dropdowns-div">
                        <Form.Select
                            className="measurement-select"
                            onChange={onDropdownSelectedTimeOx}
                            aria-label="Select activity"
                        >
                            <option selected disabled>
                                {" "}
                                Select time{" "}
                            </option>
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
                            onClick={fetch_data_ox}
                            placeholder="Plot graph"
                        >
                            Plot Graph
                        </button>
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

                </div>
                <div className="stili">

                    <div className="plot-title3">
                        <b>Measurements</b>
                    </div>
                    <div className="dropdowns-div">
                        <Form.Select
                            className="measurement-select"
                            aria-label="Select Date"
                            onChange={onDropdownSelectedDateCustomOx}
                        >
                            <option selected disabled>
                                {" "}
                                Select Date{" "}
                            </option>
                            {dates_dropdown_ox.map(date_dropdown =>
                                <option
                                    key={date_dropdown}
                                    value={date_dropdown}
                                >
                                    {date_dropdown}
                                </option>
                            )}
                            {/* {createSelectItemsTimeCustomOx} */}
                        </Form.Select>
                        <button
                            className="plot_btn"
                            onClick={fetch_custom_data_ox}
                            placeholder="Plot graph"
                        >
                            Plot Graph
                        </button>
                    </div>

                    {
                        <main className="DoughnutChartContent">
                            <div className="DoughnutChartWrapper">
                                <DoughnutChart
                                    oxygen={aveOxygen_custom}
                                // labels={this.state.oxygenlabels}
                                />
                            </div>
                        </main>
                    }
                </div>
            </div>

            <div className="plot-title">
                <b>HRV</b>
            </div>
            <div className="plot-title3">
                <b>Measurements</b>
            </div>
            <div className="dropdowns-div">
                <Form.Select
                    className="measurement-select"
                    aria-label="Select Date"
                    onChange={onDropdownSelectedDateCustomHrv}
                >
                    <option selected disabled>
                        {" "}
                        Select Date{" "}
                    </option>
                    {dates_dropdown_hrv.map(date_dropdown_hrv =>

                        <option
                            key={date_dropdown_hrv}
                            value={date_dropdown_hrv}
                        >
                            {date_dropdown_hrv}
                        </option>
                    )}
                </Form.Select>
                <button
                    className="plot_btn"
                    onClick={fetch_custom_data_hrv}
                    placeholder="Plot graph"
                >
                    Plot Graph
                </button>
            </div>
            {
                <main className="DoughnutChartContent">
                    <div className="DoughnutChartWrapper">
                        <DoughnutChart
                            oxygen={hrv_custom}
                        />
                    </div>
                </main>
            }



            <ChoicesBoxesBottom />
        </div>
    );
}

export default User;




