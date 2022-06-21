import React from "react";

import "./scss/style.scss";
import { getDatabase, ref, child, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";
import profile_pic from "../../logos/profile-icon2.png";
import ChoicesBoxesLoggedIn from "../ChoicesBoxesLoggedIn/ChoicesBoxesLoggedIn";
import LineChart from "../Charts/LineChart";

import Form from "react-bootstrap/Form";

class ProfileUser extends React.Component {
  constructor(props) {
    super(props);
    this.up_counter = this.up_counter.bind(this);
    this.down_counter = this.down_counter.bind(this);
    this.up_repeat = this.up_repeat.bind(this);
    this.down_repeat = this.down_repeat.bind(this);
    this.toggleChanged = this.toggleChanged.bind(this);

    // this.document.querySelector = this.document.querySelector.bind(this);

    this.state = {
      click: true,
      email: "",
      allow_notifications: "",
      measurement_counter: 0,
      repeat_time: "",
      labels: [],
      heartRatesData: [],
      // checked: ""
    };
  }
  async componentDidMount() {
    if (this.state === undefined) {
      return;
    }
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${uid}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              console.log(snapshot.val());
              this.setState({
                email: snapshot.val().email,
                measurement_counter: parseInt(
                  snapshot.val().measurement_counter
                ),
                repeat_time: snapshot.val().repeat_time,
                allow_notifications: snapshot.val().allow_notifications,
              });
              const { heartRate } = snapshot.val();
              for (let el in heartRate) {
                //el for activity type
                this.state.labels = [...Object.keys(heartRate[el])]; //left part for timestamp
                this.state.heartRatesData = [...Object.values(heartRate[el])]; // for values
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
          confirmButtonColor: "#2a4cd3",
        }).then(function () {
          window.location.href = "/";
          console.log("error here");
        });
      }
    });
  }

  createSelectItems() {
    let items = [];
    for (let i = 0; i <= 10; i++) {
      items.push(
        <option key={i} value={i}>
          {i.toString() + "ASDASD"}
        </option>
      );
    }
    return items;
  }

  onDropdownSelected(e) {
    console.log("THE VAL", e.target.value);
    //here you will see the current selected value of the select input
  }

  up_repeat() {
    var temp = this.state.repeat_time;
    if (temp < 24) {
      this.setState({
        repeat_time: temp + 1,
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
          repeat_time: this.state.repeat_time,
        });
      } else {
        // User is signed out
        // ...
      }
    });
  }

  down_repeat() {
    var temp = this.state.repeat_time;
    if (temp > 0) {
      this.setState({
        repeat_time: temp - 1,
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
          repeat_time: this.state.repeat_time,
        });
      } else {
        // User is signed out
        // ...
      }
    });
  }
  up_counter() {
    var temp = this.state.measurement_counter;
    if (temp < 96) {
      this.setState({
        measurement_counter: temp + 5,
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
          measurement_counter: this.state.measurement_counter,
        });
      } else {
        // User is signed out
        // ...
      }
    });
  }

  down_counter() {
    var temp = this.state.measurement_counter;
    if (temp > 14) {
      this.setState({
        measurement_counter: temp - 5,
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
          measurement_counter: this.state.measurement_counter,
        });
      } else {
        // User is signed out
        // ...
      }
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
              <div className="circle">
                <div className="circle__one"></div>
              </div>
              <p id="email">
                Email: <b>{this.state.email}</b>
              </p>
            </div>
            <div className="hero__info">
              <div className="circle">
                <div className="circle__one"></div>
              </div>
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
              <div className="circle">
                <div className="circle__one"></div>
              </div>
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
              <div className="circle">
                <div className="circle__one"></div>
              </div>
              <p id="repeat_time">
                Repeat notification every: <b>{this.state.repeat_time}</b>
              </p>
              <button className="up_down_button" onClick={this.up_repeat}>
                +
              </button>
              <button className="up_down_button" onClick={this.down_repeat}>
                -
              </button>
            </div>
          </div>
        </section>
        {/* <ChoicesBoxesLoggedIn /> */}
        <div class="dropdowns-div">
          <Form.Select
            className="measurement-select"
            onChange={this.onDropdownSelected}
            aria-label="Default select example"
          >
            {this.createSelectItems()}
          </Form.Select>

          <Form.Select
            className="measurement-select"
            onChange={this.onDropdownSelected}
            aria-label="Default select example"
          >
            {this.createSelectItems()}
          </Form.Select>
        </div>

        {this.state.heartRatesData && this.state.labels && (
          <main className="ChartContent">
            <div className="ChartWrapper">
              <LineChart
                heartrate={this.state.heartRatesData}
                labels={this.state.labels}
              />
            </div>
          </main>
        )}
      </div>
    );
  }
}

export default ProfileUser;
