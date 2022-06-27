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


import watch from '../../logos/watch.png';
import repeat_time from '../../logos/repeat_time.png';
import notification from '../../logos/notification.png';
import user from '../../logos/users.png';
import email from '../../logos/email.png';





class ProfileUser extends React.Component {
  constructor(props) {
    super(props);
    this.up_counter = this.up_counter.bind(this);
    this.down_counter = this.down_counter.bind(this);
    this.up_repeat = this.up_repeat.bind(this);
    this.down_repeat = this.down_repeat.bind(this);
    this.toggleChanged = this.toggleChanged.bind(this);
    this.onDropdownSelected = this.onDropdownSelected.bind(this);
    // this.fetch_data = this.fetch_data.bind(this);
    // this.document.querySelector = this.document.querySelector.bind(this);

    this.state = {
      click: true,
      email: "",
      allow_notifications: "",
      measurement_counter: 0,
      repeat_time: "",
      selected_type: "heartRate",
      labels: [],
      heartRatesData: [],
      oxygenData: [],
      oxygenlabels: [],
      measurement_types: [],
      activity_types: [],
      show: false,
      aveOxygen: 0,
      id_user: "",
      // checked: ""
    };
  }
  async componentDidMount() {
    // const { history, location } = this.props;
    if (this.state === undefined) {
      return;
    }
    // await console.log(this.props.location.query)
    // console.log(this.context.router)
    var uid = this.props.user_id
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user to see his profile")
        this.setState({
          id_user: user.uid
        })
        console.log(this.state.id_user);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${user.uid}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.setState({
                email: snapshot.val().email,
                measurement_counter: parseInt(snapshot.val().measurement_counter),
                repeat_time: snapshot.val().repeat_time,
                allow_notifications: snapshot.val().allow_notifications,
              });
              console.log("We are going to test");
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
                  this.state.labels = [...Object.keys(heartRate[el])]; //left part for timestamp
                  this.state.heartRatesData = [...Object.values(heartRate[el])]; // for values
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

    console.log(this.state.id_user)

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
    this.fetch_data();
  }

  fetch_data() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${uid}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              if (this.state.selected_type == "heartRate") {
                const { heartRate } = snapshot.val();

                for (let el in heartRate) {
                  this.state.activity_types.push(el);
                  //el for activity type
                  this.state.labels = [...Object.keys(heartRate[el])]; //left part for timestamp
                  this.state.heartRatesData = [...Object.values(heartRate[el])]; // for values
                }
              }
              if (this.state.selected_type == "oxygen") {
                const { oxygen } = snapshot.val();
                this.state.activity_types = [];
                const temp_labels = [];
                const temp_data = [];
                for (let el in oxygen) {
                  //el for activity type
                  this.state.activity_types.push(el);
                  this.state.oxygenlabels = [...Object.keys(oxygen[el])]; //left part for timestamp
                  this.state.oxygenData = [...Object.values(oxygen[el])]; // for values
                }
                console.log("Here are oxygen average");
                const average =
                  this.state.oxygenData.reduce((a, b) => a + b, 0) /
                  this.state.oxygenData.length;
                this.state.aveOxygen = average;
                this.setState({ aveOxygen: average });
              }
            } else {
              console.log("No data available");
              window.location.href = "/profile_admin";
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

  up_repeat() {
    console.log(this.state.id_user)

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
      console.log("Checked");
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
              <h3> Profile Info </h3>
            </div>
            <div className="hero__info">
              <img src={email} className="image_search" alt={email} />

              <p id="email">
                Email: <b>{this.state.email}</b>
              </p>
            </div>
            <div className="hero__info">
              <img src={notification} className="image_search" alt={notification} />

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
              <img src={repeat_time} className="image_search" alt={repeat_time} />

              <p id="repeat_time">
                Repeat notification every: <b>{this.state.repeat_time}</b>
              </p>
              <button className="up_down_button" onClick={this.up_repeat.bind(this)}>
                +
              </button>
              <button className="up_down_button" onClick={this.down_repeat.bind(this)}>
                -
              </button>
            </div>
          </div>
        </section>
        {/* <ChoicesBoxesLoggedIn /> */}
        <div className="dropdowns-div">
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

        {(this.state.selected_type == "heartRate" &&
          this.state.heartRatesData &&
          this.state.labels && (
            <main className="ChartContent">
              <div className="ChartWrapper">
                <LineChart
                  heartrate={this.state.heartRatesData}
                  labels={this.state.labels}
                />
              </div>
            </main>
          )) || (
            <main className="ChartContent">
              <div className="ChartWrapper">
                <LineChart
                  heartrate={this.state.oxygenData}
                  labels={this.state.oxygenlabels}
                />
              </div>
            </main>
          )}
        <ChoicesBoxesBottom />

      </div>
    );
  }
}

export default ProfileUser;


