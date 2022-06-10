import React from 'react';
import FeedAdmin from "./FeedAdmin.jsx";
import search from '../../logos/sensors.png';
import Swal from "sweetalert2";
import { getDatabase, ref, child, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

class ShowAdmins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      click: true,
      admins: [],
      keywords: [],
      kk: ""
    };
  }
  async componentDidMount() {
    // if (this.state === undefined) { return }
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        const dbRef = ref(getDatabase());
        get(child(dbRef, `admins`)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
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
  // changeState = async (event) =>  {
  //     const keywords = this.state.keywords;
  //     let raw = JSON.stringify({
  //         keywords: keywords
  //     })
  //     var myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "application/json");

  //     let requestOptions;
  //     let api_request = ""
  //     const keys = document.getElementById('key_search').value
  //     if (raw.length === 0 || keys === "") {
  //         this.setState({
  //             questions: []
  //         })
  //         requestOptions = {
  //             method: 'GET',
  //             headers: myHeaders,
  //             redirect: 'follow'
  //         };
  //         api_request = "/question"
  //     }
  //     else {
  //         this.setState({
  //             questions: []
  //         })
  //         requestOptions = {
  //             method: 'POST',
  //             headers: myHeaders,
  //             body: raw,
  //             redirect: 'follow'
  //         };
  //         api_request = "/questions/questionsPerKeyword"
  //     }


  //     await fetch(show_qa_url + api_request, requestOptions)
  //         .then(response => {
  //             if (response.status === 200) {
  //               return response.text();
  //             } else {
  //               throw new Error(response.status);
  //             }
  //         })
  //         .then(async result => {
  //             const json = JSON.parse(result)
  //             await this.setState({
  //                 questions: json.result

  //             })
  //             //this.render()
  //             console.log(this.state.questions)
  //             //window.location.replace("/");
  //             //window.location.reload();
  //         })
  //         .catch(error => {
  //             Swal.fire({
  //               title: 'Error!',
  //               text: error,
  //               icon: 'error',
  //               customClass: "swal_ok_button",
  //               confirmButtonColor: "#242424"
  //             });
  //         });
  // }
  closeMobileMenu = () => this.setState({ click: false });
  changeState = async (event) => {
    // this.state.admins.map(admin => console.log(admin))
    console.log(this.state.admins[0])
  }

  render() {
    return (
      <div>
        <div className="answer_title">Answer a question!</div>
        <div className="wrap">
          <div className="search">
            <input type="text" className="searchTerm" id="key_search" placeholder="Search by keyword, separated by space.." onChange={(e) => { this.setState({ keywords: e.target.value.split(' ') }) }} />
            <button type="submit" className="searchButton"
              onClick={this.changeState}>
              <img src={search} className="image_search" alt={search} />
            </button>
          </div>
        </div>
        <div className="ppp">
          {this.state.admins.map(admin =>
            <div key={admin}>
              <FeedAdmin admin={admin} />
            </div>
          )}
        </div>
      </div>
    );
  }
}


export default ShowAdmins;