import React from 'react';
import FeedUser from "./FeedUser.jsx";
import search from '../../logos/search-icon2.png';
import Swal from "sweetalert2";
import { getDatabase, ref, child, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";


class ShowUsers extends React.Component {
  constructor(props) {
    super(props);
    this.changeState = this.changeState.bind(this);
    this.state = {
      click: true,
      admin: "",
      searchword: "",
      users: [],
      data: true
    };
  }
  async componentDidMount() {
    const auth = getAuth();
    onAuthStateChanged(auth, (admin) => {
      if (admin) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const admin_id = admin.uid;
        this.setState({
          admin: admin_id
        })
        const dbRef = ref(getDatabase());
        get(child(dbRef, `admins/${admin_id}/users`)).then((snapshot) => {
          if (snapshot.exists()) {
            const users = snapshot.val();
            console.log(users)
            this.setState({
              users: users,
            })
            var no_users = document.getElementById("not_found");
            // console.log(no_users)
            no_users.className = "notfound"
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
          confirmButtonColor: "#6a98ce"
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
    if (this.state.searchword === "") {
      get(child(dbRef, `admins/${this.state.admin}/users`)).then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          console.log(users)
          console.log(users.length)
          this.setState({
            users: users
          })
          var no_users = document.getElementById("not_found");
          no_users.className = "notfound"
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
      get(child(dbRef, `users`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          const users = snapshot.val();
          console.log(users)
          var myArray = []
          const search_word_lower = this.state.searchword.toLowerCase()
          for (let el in users) {
            console.log(users[el].email);
            const email_lower = users[el].email.toLowerCase()
            if (email_lower.includes(search_word_lower) && this.state.users.includes(el)) {
              myArray.push(el)
            }
          }
          console.log(myArray)
          this.setState({
            users: myArray
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
  }

  render() {
    return (
      <div className='general'>
        <div className="answer_title"><b>Users</b></div>
        <div className="wrap">
          <div className="search">
            <input type="text" className="searchTerm" id="key_search" placeholder="Search user by email..."
              onChange={(e) => { this.setState({ searchword: e.target.value }) }} />
            <button type="submit" className="searchButton"
              onClick={this.changeState}>
              <img src={search} className="image_search" alt={search} />
            </button>
          </div>
        </div>
        <div className="ppp">
          {this.state.users.map(user =>
            <div key={user}>
              <FeedUser admin={this.state.admin} user_id={user} total_users={this.state.users.length} users={this.state.users}/>
            </div>
          )}
        </div>
        <div id="not_found" style={{ display: "visible" }}>No users found..</div>
      </div>
    );
  }
}


export default ShowUsers;