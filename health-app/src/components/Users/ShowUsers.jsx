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
      users: []
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
              users: users
            })
          }
          else {
            console.log("No data available");
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
          if (last_name_lower.includes(search_word_lower)){
            myArray.push(el)
          }
        }
        console.log(myArray)
        this.setState({
          admins: myArray
        })
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
        <div className="answer_title"><b>Users</b></div>
        <div className="wrap">
          <div className="search">
            <input type="text" className="searchTerm" id="key_search" placeholder="Search user by email..." 
            onChange={(e) => { this.setState({ searchword: e.target.value})}} />
            <button type="submit" className="searchButton"
              onClick={this.changeState}>
              <img src={search} className="image_search" alt={search} />
            </button>
          </div>
        </div>
        <div className="ppp">
          {this.state.users.map(user =>
            <div key={user}>
              <FeedUser admin={this.state.admin} user_id={user}/>
            </div>
          )}
        </div>
      </div>
    );
  }
}


export default ShowUsers;