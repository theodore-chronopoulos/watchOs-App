import React from 'react';
import FeedAdmin from "./FeedAdmin.jsx";
import search from '../../logos/search-icon2.png';
import Swal from "sweetalert2";
import { getDatabase, ref, child, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

class ShowAdmins extends React.Component {
  constructor(props) {
    super(props);
    this.changeState = this.changeState.bind(this);
    this.state = {
      click: true,
      admins: [],
      searchword: "",
      user_id: ""
    };
  }
  async componentDidMount() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        this.setState({
          user_id: uid
        })
        const dbRef = ref(getDatabase());
        get(child(dbRef, `admins`)).then((snapshot) => {
          if (snapshot.exists()) {
            const admins = snapshot.val();
            console.log(admins)
            var myArray = []
            for (let el in admins) {
              console.log(typeof el);
              myArray.push(el)
            }
            console.log(myArray)
            this.setState({
              admins: myArray
            })
            console.log(this.state.admins)
            this.state.admins.forEach(admin => console.log(admin))
            this.state.admins.map(admin => console.log(admin.address))
            var no_users = document.getElementById("not_found");
            no_users.className = "notfound "
          }
          else {
            console.log("No data available");
            var no_users = document.getElementById("not_found");
            no_users.className = "visible"
            // window.location.href = '/';
          }
        }).catch((error) => {
          console.error(error);
        });
      }
      else {
        // User is signed out
        Swal.fire({
          title: 'Not authenticated',
          text: 'Please sign in',
          icon: 'info',
          customClass: "swal_ok_button",
          confirmButtonColor: "#2a4cd3"
        }).then(function () {
          window.location.href = '/';
          console.log("error here");
        });
      }
    });
  }

  closeMobileMenu = () => this.setState({ click: false });
  changeState = async (event) => {
    // this.state.admins.map(admin => console.log(admin))
    console.log(this.state.searchword)
    const dbRef = ref(getDatabase());
    get(child(dbRef, `admins`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        const admins = snapshot.val();
        console.log(admins)
        var myArray = []
        const search_word_lower = this.state.searchword.toLowerCase()
        for (let el in admins) {
          console.log(admins[el].last_name);
          const last_name_lower = admins[el].last_name.toLowerCase()
          const first_name_lower = admins[el].first_name.toLowerCase()
          const full_name = first_name_lower + " " + last_name_lower

          if (full_name.includes(search_word_lower)) {
            myArray.push(el)
          }
        }
        console.log(myArray)
        this.setState({
          admins: myArray
        })
        if (myArray.length == 0) {
          console.log("here")
          var no_users = document.getElementById("not_found");
          no_users.className = "visible"
        }
        else {
          var no_users = document.getElementById("not_found");
          no_users.className = "notfound"
        }
        // console.log(this.state.admins)
        // this.state.admins.forEach(admin => console.log(admin))
        // this.state.admins.map(admin => console.log(admin.address))
      }
      else {
        console.log("No data available");
        // window.location.href = '/';
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <div>
        <div className="answer_title"><b>Professionals</b></div>
        <div className="wrap">
          <div className="search">
            <input type="text" className="searchTerm" id="key_search" placeholder="Search a proffesional by name..."
              onChange={(e) => { this.setState({ searchword: e.target.value }) }} />
            <button type="submit" className="searchButton"
              onClick={this.changeState}>
              <img src={search} className="image_search" alt={search} />
            </button>
          </div>
        </div>
        <div className="ppp">
          {this.state.admins.map(admin =>
            <div key={admin}>
              <FeedAdmin admin={admin} user_id={this.state.user_id} />
            </div>
          )}
        </div>
        <div id="not_found" style={{ display: "visible" }}>No professionals found..</div>

      </div>
    );
  }
}


export default ShowAdmins;