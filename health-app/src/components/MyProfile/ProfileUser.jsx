import React from "react";
import "./scss/style.scss";
import { getDatabase, ref, child, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";
import profile_pic from "../../logos/teliko.png";
import ChoicesBoxesBottom from "../ChoicesBoxesBottom/ChoicesBoxesBottom";
import LineChart from "../Charts/LineChart";
import DoughnutChart from "../Charts/DoughnutChart";

import Form from "react-bootstrap/Form";

import watch from "../../logos/watch.png";
import repeat_time from "../../logos/repeat_time.png";
import notification from "../../logos/notification.png";
import user from "../../logos/users.png";
import email from "../../logos/email.png";

class ProfileUser extends React.Component {
  constructor(props) {
    super(props);
    this.up_counter = this.up_counter.bind(this);
    this.down_counter = this.down_counter.bind(this);
    this.up_repeat = this.up_repeat.bind(this);
    this.down_repeat = this.down_repeat.bind(this);
    this.toggleChanged = this.toggleChanged.bind(this);
    this.onDropdownSelected = this.onDropdownSelected.bind(this);
    this.onDropdownSelectedTimeOx = this.onDropdownSelectedTimeOx.bind(this);
    this.onDropdownSelectedActivity = this.onDropdownSelectedActivity.bind(this);
    this.onDropdownSelectedActivityCustom = this.onDropdownSelectedActivityCustom.bind(this);
    this.onDropdownSelectedDateCustomHrv = this.onDropdownSelectedDateCustomHrv.bind(this);
    this.onDropdownSelectedTime = this.onDropdownSelectedTime.bind(this);
    this.onDropdownSelectedDateCustom = this.onDropdownSelectedDateCustom.bind(this);
    this.onDropdownSelectedDateCustomOx = this.onDropdownSelectedDateCustomOx.bind(this);
    this.fetch_data = this.fetch_data.bind(this);
    this.plotgraphs = this.plotgraphs.bind(this);
    this.plotgraphscustom = this.plotgraphscustom.bind(this);
    this.plotgraphs_ox = this.plotgraphs_ox.bind(this);
    this.plotgraphscustom_ox = this.plotgraphscustom_ox.bind(this);
    this.plotgraphscustom_hrv = this.plotgraphscustom_hrv.bind(this);
    // this.plotgraphs_ox_custom = this.plotgraphs_ox_custom.bind(this);

    this.state = {
      click: true,
      email: "",
      allow_notifications: "",
      measurement_counter: 0,
      repeat_time: "",
      selected_type: "heartRate",
      selected_custom_activity: "",
      slected_custom_date: "",
      labels: [],
      heartRatesData: [],
      custom_data: [],
      custom_labels: [],
      custom_aveOxygen: 0,
      oxygenData: [],
      oxygenlabels: [],
      measurement_types: [],
      activity_types: [],
      dates_dropdown: [],
      dates_dropdown_ox: [],
      dates_dropdown_hrv:[],
      show: false,
      slected_custom_date_ox:"",
      slected_custom_date_hrv:"",
      aveOxygen: 0.5,
      aveOxygen_custom: 0.5,
      id_user: "",
      selected_activity: "",
      selected_time: "",
      selected_time_ox: "",
      hrv_custom: 0.5,
      time_options: ["This Month", "Last Measurement"],

      // checked: ""
    };
  }
  async componentDidMount() {
    // const { history, location } = this.props;
    if (this.state === undefined) {
      return;
    }

    var uid = this.props.user_id;
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user to see his profile");
        this.setState({
          id_user: user.uid,
        });
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${user.uid}`))
          .then((snapshot) => {
            this.state.activity_types = [];
            if (snapshot.exists()) {
              this.setState({
                email: snapshot.val().email,
                measurement_counter: parseInt(
                  snapshot.val().measurement_counter
                ),
                repeat_time: snapshot.val().repeat_time,
                allow_notifications: snapshot.val().allow_notifications,
              });
              for (let el in snapshot.val()) {
                if (el == "heartRate" || el == "oxygen") {
                  this.state.measurement_types.push(el);
                }
              }
              if (this.state.selected_type == "heartRate") {
                const { heartRate } = snapshot.val();

                for (let el in heartRate) {
                  this.state.activity_types.push(el);
                  //el for activity type
                  //   this.state.labels = [...Object.keys(heartRate[el])]; //left part for timestamp
                  //   this.state.heartRatesData = [...Object.values(heartRate[el])]; // for values
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
      } else {
        // User is signed out
        Swal.fire({
          title: "Not authenticated",
          text: "Please sign in",
          icon: "info",
          customClass: "swal_ok_button",
          confirmButtonColor: "#6a98ce",
        }).then(function () {
          window.location.href = "/";
          console.log("error here");
        });
      }
    });
  }

  createSelectItems() {
    let items = [];
    for (let i = 0; i < this.state.measurement_types.length; i++) {
      items.push(
        <option
          key={this.state.measurement_types[i]}
          value={this.state.measurement_types[i]}
        >
          {this.state.measurement_types[i]}
        </option>
      );
    }
    return items;
  }
  createSelectItemsTime() {
    let items = [];
    for (let i = 0; i < this.state.time_options.length; i++) {
      items.push(
        <option
          key={this.state.time_options[i]}
          value={this.state.time_options[i]}
        >
          {this.state.time_options[i]}
        </option>
      );
    }
    return items;
  }
  createSelectItemsTimeCustom() {
    let items = [];
    for (let i = 0; i < this.state.dates_dropdown.length; i++) {
      items.push(
        <option
          key={this.state.dates_dropdown[i]}
          value={this.state.dates_dropdown[i]}
        >
          {this.state.dates_dropdown[i]}
        </option>
      );
    }
    return items;
  }
  createSelectItemsTimeCustomHrv(){
    const dbRef = ref(getDatabase());
    var datesarray = [];
    get(child(dbRef,`users/${this.state.id_user}/hrv/`))
    .then((snapshot) => {
      var keys = Object.keys(snapshot.val())
      keys.forEach((keys, index) => {
        datesarray.push(keys);
      });
      this.setState({dates_dropdown_hrv: datesarray})
    }
    )
    let items = [];
    for (let i = 0; i < this.state.dates_dropdown_hrv.length; i++) {
      items.push(
        <option
          key={this.state.dates_dropdown_hrv[i]}
          value={this.state.dates_dropdown_hrv[i]}
        >
          {this.state.dates_dropdown_hrv[i]}
        </option>
      );
    }
    return items;

  }

  createSelectItemsTimeCustomOx() {
    const dbRef = ref(getDatabase());
    var datesarray = [];
    get(child(dbRef,`users/${this.state.id_user}/oxygen/`))
    .then((snapshot) => {
      var keys = Object.keys(snapshot.val())
      keys.forEach((keys, index) => {
        datesarray.push(keys);
      });
      this.setState({dates_dropdown_ox: datesarray})
    }
    )
    let items = [];
    for (let i = 0; i < this.state.dates_dropdown_ox.length; i++) {
      items.push(
        <option
          key={this.state.dates_dropdown_ox[i]}
          value={this.state.dates_dropdown_ox[i]}
        >
          {this.state.dates_dropdown_ox[i]}
        </option>
      );
    }
    return items;
  }
  createSelectItemsActivities() {
    let items = [];
    for (let i = 0; i < this.state.activity_types.length; i++) {
      items.push(
        <option
          key={this.state.activity_types[i]}
          value={this.state.activity_types[i]}
        >
          {this.state.activity_types[i]}
        </option>
      );
    }
    return items;
  }

  onDropdownSelected(e) {
    this.setState({ selected_type: e.target.value });
    this.state.selected_type = e.target.value;
  }

  onDropdownSelectedDateCustom(e) {
    this.setState({ slected_custom_date: e.target.value });
    this.state.slected_custom_date = e.target.value;
  }
  onDropdownSelectedDateCustomOx(e) {
    this.setState({ slected_custom_date_ox: e.target.value });
    this.state.slected_custom_date_ox = e.target.value;
  }
  onDropdownSelectedDateCustomHrv(e){
    this.setState({slected_custom_date_hrv: e.target.value});
    this.state.slected_custom_date_hrv = e.target.value
  }
  onDropdownSelectedActivityCustom(e) {
    this.setState({ selected_custom_activity: e.target.value });
    this.state.selected_custom_activity = e.target.value;
    const dbRef = ref(getDatabase());
    var datesarray = [];
    get(
      child(
        dbRef,
        `users/${this.state.id_user}/${this.state.selected_type}/${this.state.selected_custom_activity}`
      )
    ).then((snapshot) => {
      var values = Object.keys(snapshot.val());
      values.forEach((keys, index) => {
        datesarray.push(keys);
      });
      this.setState({ dates_dropdown: datesarray });
      this.state.dates_dropdown = datesarray;
    });
  }

  onDropdownSelectedActivity(e) {
    this.setState({ selected_activity: e.target.value });
    this.state.selected_activity = e.target.value;
  }

  onDropdownSelectedTime(e) {
    this.setState({ selected_time: e.target.value });
    this.state.selected_time = e.target.value;
  }
  onDropdownSelectedTimeOx(e) {
    this.setState({ selected_time_ox: e.target.value });
    this.state.selected_time_ox = e.target.value;
  }
  plotgraphs() {
    this.fetch_data();
  }

  plotgraphs() {
    this.fetch_data();
  }

  plotgraphscustom() {
    this.fetch_custom_data();
  }
  plotgraphscustom_ox() {
    this.fetch_custom_data_ox();
  }
  plotgraphscustom_hrv(){
    this.fetch_custom_data_hrv();
  }

  plotgraphs_ox() {
    this.fetch_data_ox();
  }

  fetch_custom_data_hrv(){
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${this.state.id_user}/hrv/${this.state.slected_custom_date_hrv}`)).then(
      (snapshot) => {
        this.setState({hrv_custom: Object.values(snapshot.val())})
      })
  }
  fetch_custom_data_ox(){
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${this.state.id_user}/oxygen/${this.state.slected_custom_date_ox}`)).then(
      (snapshot) => {
        this.setState({aveOxygen_custom: Object.values(snapshot.val())})
      })
    
  }

  fetch_data_ox() {
    const dbRef = ref(getDatabase());
    if (this.state.selected_time_ox == "Last Measurement") {
      get(child(dbRef, `users/${this.state.id_user}/oxygen/`)).then(
        (snapshot) => {
          const index = Object.keys(snapshot.val()).length;
          const measurement = Object.keys(snapshot.val())[index - 1];
          get(
            child(dbRef, `users/${this.state.id_user}/oxygen/${measurement}`)
          ).then((snapshot) => {
            console.log(snapshot.val());
            this.setState({ aveOxygen: Object.values(snapshot.val()) });
            console.log(this.state.aveOxygen);
          });
        }
      );
    }
    if (this.state.selected_time_ox == "This Month") {
      var today = new Date();
      var current_month = today.getMonth() + 1;
      get(child(dbRef, `users/${this.state.id_user}/oxygen/`)).then(
        (snapshot) => {
          var oxygenmonthdata = [];
          for (let el in snapshot.val()) {
            var month = parseInt(el[5] + el[6]);
            if (month == current_month) {
              get(
                child(dbRef, `users/${this.state.id_user}/oxygen/${el}`)
              ).then((snapshot) => {
                var temp = Object.values(snapshot.val());
                oxygenmonthdata.push(temp[0]);
                var average =
                  oxygenmonthdata.reduce((a, b) => a + b, 0) /
                  oxygenmonthdata.length;
                this.setState({ aveOxygen: average });
              });
            }
          }
        }
      );
    }
  }

  fetch_custom_data() {
    const dbRef = ref(getDatabase());
    get(
      child(
        dbRef,
        `users/${this.state.id_user}/heartRate/${this.state.selected_custom_activity}/${this.state.slected_custom_date}`
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
        this.setState({ custom_data: valuesarray });
        this.setState({ custom_labels: timestamps });
        this.setState({ custom_aveOxygen: average });
      }
    });
  }

  fetch_data() {
    const dbRef = ref(getDatabase());
    get(
      child(
        dbRef,
        `users/${this.state.id_user}/heartRate/${this.state.selected_activity}`
      )
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          if (this.state.selected_time == "Last Measurement") {
            var timestamps = [];
            var averages = [];
            var valuesarray = [];
            const index = Object.keys(snapshot.val()).length;
            const measurement = Object.keys(snapshot.val())[index - 1];
            // for hr last measurement
            get(
              child(
                dbRef,
                `users/${this.state.id_user}/${this.state.selected_type}/${this.state.selected_activity}/${measurement}`
              )
            ).then((snapshot) => {
              var values = Object.values(snapshot.val());
              var keys = Object.keys(snapshot.val());
              values.forEach((value, index) => {
                valuesarray.push(value);
              });
              keys.forEach((value, index) => {
                timestamps.push(value);
              });
              this.setState({ heartRatesData: valuesarray });
              this.setState({ labels: timestamps });
            });
          }
          if (this.state.selected_time == "This Month") {
            var today = new Date();
            var current_month = today.getMonth() + 1;
            var timestamps = [];
            var averages = [];
            var valuesarray = [];
            this.state.heartRatesData = [];
            this.state.labels = [];
            //heartrate for current month
            for (let el in snapshot.val()) {
              var month = parseInt(el[5] + el[6]);
              if (month == current_month) {
                get(
                  child(
                    dbRef,
                    `users/${this.state.id_user}/heartRate/${this.state.selected_activity}/${el}`
                  )
                ).then((snapshot) => {
                  this.state.labels.push(el);
                  var values = Object.values(snapshot.val());
                  values.forEach((value, index) => {
                    valuesarray.push(value);
                  });
                  var average =
                    values.reduce((a, b) => a + b, 0) / values.length;
                  averages.push(average);
                  this.setState({ heartRatesData: averages });
                });
              }
            }
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  up_repeat() {
    var temp = this.state.repeat_time;
    if (temp < 24) {
      this.setState({
        repeat_time: temp + 1,
      });
    }
    const db = getDatabase();
    update(ref(db, "users/" + this.state.id_user), {
      repeat_time: this.state.repeat_time,
    });
  }

  down_repeat() {
    var temp = this.state.repeat_time;
    if (temp > 0) {
      this.setState({
        repeat_time: temp - 1,
      });
    }
    const db = getDatabase();
    update(ref(db, "users/" + this.state.id_user), {
      repeat_time: this.state.repeat_time,
    });
  }
  up_counter() {
    var temp = this.state.measurement_counter;
    if (temp < 96) {
      this.setState({
        measurement_counter: temp + 5,
      });
    }
    const db = getDatabase();
    update(ref(db, "users/" + this.state.id_user), {
      measurement_counter: this.state.measurement_counter,
    });
  }

  down_counter() {
    var temp = this.state.measurement_counter;
    if (temp > 14) {
      this.setState({
        measurement_counter: temp - 5,
      });
    }
    const db = getDatabase();
    update(ref(db, "users/" + this.state.id_user), {
      measurement_counter: this.state.measurement_counter,
    });
  }
  toggleChanged() {
    var checkbox = document.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
      // do this

      this.setState({
        allow_notifications: true,
      });
    } else {
      // do that
      console.log("Not checked");
      this.setState({
        allow_notifications: false,
      });
    }
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        const db = getDatabase();
        update(ref(db, "users/" + uid), {
          allow_notifications: this.state.allow_notifications.toString(),
        });
      } else {
        // User is signed out
        // ...
      }
    });
  }

  closeMobileMenu = () => this.setState({ click: false });

  render() {
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
              <img src={email} className="image_search" alt={email} />

              <p id="email">
                Email: <b>{this.state.email}</b>
              </p>
            </div>
            <div className="hero__info">
              <img
                src={notification}
                className="image_search"
                alt={notification}
              />

              <p id="allow_notifications">
                Allow notifications:{" "}
                <b>{this.state.allow_notifications.toString()}</b>
              </p>
              <label className="switch">
                {/* <input type="checkbox" onChange={this.toggleChanged} id ='toggle'/>
                                <span className="slider round"></span> */}
              </label>
            </div>
            <div className="hero__info">
              <img src={watch} className="image_search" alt={watch} />

              <p id="measurement_counter">
                Ammount of measurements: <b>{this.state.measurement_counter}</b>
              </p>
              <button className="up_down_button" onClick={this.up_counter}>
                +
              </button>
              <button className="up_down_button" onClick={this.down_counter}>
                -
              </button>
            </div>
            <div className="hero__info">
              <img
                src={repeat_time}
                className="image_search"
                alt={repeat_time}
              />

              <p id="repeat_time">
                Repeat notification every: <b>{this.state.repeat_time}</b>
              </p>
              <button
                className="up_down_button"
                onClick={this.up_repeat.bind(this)}
              >
                +
              </button>
              <button
                className="up_down_button"
                onClick={this.down_repeat.bind(this)}
              >
                -
              </button>
            </div>
          </div>
        </section>
        <div className="dropdowns-div">
          <Form.Select
            className="measurement-select"
            onChange={this.onDropdownSelectedActivity}
            aria-label="Select activity"
            label="Select activity"
            placeholder="Select activity"
          >
            <option selected disabled>
              {" "}
              Select activity
            </option>
            {this.createSelectItemsActivities()}
          </Form.Select>

          <Form.Select
            className="measurement-select"
            onChange={this.onDropdownSelectedTime}
            aria-label="Select activity"
          >
            <option selected disabled>
              {" "}
              Select time{" "}
            </option>
            {this.createSelectItemsTime()}
          </Form.Select>

          <button
            className="plot_btn"
            onClick={this.plotgraphs}
            placeholder="Plot graph"
          >
            Plot Graph
          </button>
        </div>
        <div className="plot-title">
          <b>Heartrate</b>
        </div>
        {this.state.heartRatesData && this.state.labels && (
          <main className="ChartContent">
            <div className="ChartWrapper">
              <LineChart
                heartrate={this.state.heartRatesData}
                labels={this.state.labels}
                timestamp={this.state.selected_time}
              />
            </div>
          </main>
        )}
        <div className="plot-title">
          <b>Oxygen level</b>
        </div>
        <div className="dropdowns-div">
          <Form.Select
            className="measurement-select"
            onChange={this.onDropdownSelectedTimeOx}
            aria-label="Select activity"
          >
            <option selected disabled>
              {" "}
              Select time{" "}
            </option>
            {this.createSelectItemsTime()}
          </Form.Select>

          <button
            className="plot_btn"
            onClick={this.plotgraphs_ox}
            placeholder="Plot graph"
          >
            Plot Graph
          </button>
        </div>

        {
          <main className="DoughnutChartContent">
            <div className="DoughnutChartWrapper">
              <DoughnutChart
                oxygen={this.state.aveOxygen}
                // labels={this.state.oxygenlabels}
              />
            </div>
          </main>
        }

        <div className="dropdowns-div">
          <Form.Select
            className="measurement-select"
            onChange={this.onDropdownSelectedActivityCustom}
            aria-label="Select activity"
            label="Select activity"
            placeholder="Select activity"
          >
            <option selected disabled>
              {" "}
              Select activity
            </option>
            {this.createSelectItemsActivities()}
          </Form.Select>

          <Form.Select
            className="measurement-select"
            aria-label="Select Date"
            onChange={this.onDropdownSelectedDateCustom}
          >
            <option selected disabled>
              {" "}
              Select Date{" "}
            </option>
            {this.createSelectItemsTimeCustom()}
          </Form.Select>

          <button
            className="plot_btn"
            onClick={this.plotgraphscustom}
            placeholder="Plot graph"
          >
            Plot Graph
          </button>
        </div>
        {this.state.heartRatesData && this.state.labels && (
          <main className="ChartContent">
            <div className="ChartWrapper">
              <LineChart
                heartrate={this.state.custom_data}
                labels={this.state.custom_labels}
                timestamp={this.state.selected_time}
              />
            </div>
          </main>
        )}
        <div className="plot-title">
          <b>Oxygen level</b>
        </div>
        <div className="dropdowns-div">
        <Form.Select
            className="measurement-select"
            aria-label="Select Date"
            onChange={this.onDropdownSelectedDateCustomOx}
          >
            <option selected disabled>
              {" "}
              Select Date{" "}
            </option>
            {this.createSelectItemsTimeCustomOx()}
          </Form.Select>
          <button
            className="plot_btn"
            onClick={this.plotgraphscustom_ox}
            placeholder="Plot graph"
          >
            Plot Graph
          </button>
        </div>

        {
          <main className="DoughnutChartContent">
            <div className="DoughnutChartWrapper">
              <DoughnutChart
                oxygen={this.state.aveOxygen_custom}
                // labels={this.state.oxygenlabels}
              />
            </div>
          </main>
        }
        <div className="plot-title">
          <b>HRV</b>
        </div>
        <div className="dropdowns-div">
        <Form.Select
            className="measurement-select"
            aria-label="Select Date"
            onChange={this.onDropdownSelectedDateCustomHrv}
          >
            <option selected disabled>
              {" "}
              Select Date{" "}
            </option>
            {this.createSelectItemsTimeCustomHrv()}
          </Form.Select>
          <button
            className="plot_btn"
            onClick={this.plotgraphscustom_hrv}
            placeholder="Plot graph"
          >
            Plot Graph
          </button>
        </div>
        {
          <main className="DoughnutChartContent">
            <div className="DoughnutChartWrapper">
              <DoughnutChart
                oxygen={this.state.hrv_custom}
              />
            </div>
          </main>
        }
        
      </div>
    );
  }
}

export default ProfileUser;
