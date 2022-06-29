import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import { getDatabase, ref, child, get, update, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import address from '../../logos/address.png';
import telephone from '../../logos/telephone.png';
import email from '../../logos/email.png';
import doctor from '../../logos/doctor.png';
import total_users from '../../logos/total_users.png';



class FeedAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.change = this.change.bind(this);

        this.state = {
            click: true,
            admin: "",
            user_id: "",
            first_name: "",
            last_name: "",
            address: "",
            city: "",
            telephone: "",
            email: "",
            users: [],
            total_users: 0
        };
    }
    async componentDidMount() {
        console.log(this.props)
        await this.setState({
            admin: this.props.admin,
            user_id: this.props.user_id
        })
        console.log(this.props.admin)
        const dbRef = ref(getDatabase());
        get(child(dbRef, `admins/${this.state.admin}`)).then((snapshot) => {
            if (snapshot.exists()) {
                this.setState({
                    first_name: snapshot.val().first_name,
                    last_name: snapshot.val().last_name,
                    city: snapshot.val().city,
                    telephone: snapshot.val().telephone,
                    address: snapshot.val().address,
                    email: snapshot.val().email,
                    total_users: parseInt(snapshot.val().total_users)
                })
                if (snapshot.val().users === undefined) {
                    this.setState({
                        users: []
                    })
                }
                else {
                    this.setState({
                        users: snapshot.val().users
                    })
                    if (snapshot.val().users.includes(this.props.user_id)) {
                        var button = document.getElementById([this.state.admin]);
                        var buttonState = button.dataset.buttonState;
                        var buttonText;
                        var buttonState;
                        buttonText = "Remove Professional";
                        buttonState = "close";
                        button.className = "btn_teo22"
                        button.innerHTML = buttonText;
                        button.dataset.buttonState = buttonState;
                    }
                    console.log(snapshot.val().users)
                }
            }
            else {
                console.log("No data available");
                // window.location.href = '/';
            }
        }).catch((error) => {
            console.error(error);
        });
        console.log(this.state.users)
    }
    change() {
        const auth = getAuth();

        var button = document.getElementById([this.state.admin]);
        var buttonState = button.dataset.buttonState;
        var buttonText;
        var buttonState;
        // var button.className;

        if (buttonState === 'report') {
            buttonText = "Remove Professional";
            buttonState = "close";
            button.className = "btn_teo22"
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    const uid = user.uid;
                    const db = getDatabase();
                    const fullname = this.state.first_name + " " + this.state.last_name;
                    const new_users = [...this.state.users, uid];
                    const new_total_users = this.state.total_users + 1
                    this.setState({
                        total_users: this.state.total_users + 1,
                        users: [...this.state.users, uid]
                    })
                    update(ref(db, 'users/' + uid + '/professionals/'), {
                        [this.state.admin]: fullname,
                    });
                    update(ref(db, 'admins/' + this.state.admin), {
                        total_users: new_total_users,
                        users: new_users
                    });
                } else {
                    // User is signed out
                    // ...
                }
            });
        } else {
            buttonText = "Add Professional";
            buttonState = "report"
            button.className = "btn_teo33"
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    const uid = user.uid;
                    const db = getDatabase();
                    const fullname = this.state.first_name + " " + this.state.last_name;
                    const new_total_users = this.state.total_users - 1
                    const array = this.state.users
                    const index = array.indexOf(uid);
                    if (index > -1) {
                        array.splice(index, 1); // 2nd parameter means remove one item only
                    }
                    this.setState({
                        total_users: this.state.total_users - 1,
                        users: array
                    })
                    remove(ref(db, 'users/' + uid + '/professionals/' + this.state.admin), {
                        // [this.state.admin]: fullname,
                    });
                    update(ref(db, 'admins/' + this.state.admin), {
                        total_users: new_total_users,
                        users: array
                    });
                } else {
                    // User is signed out
                }
            });
        }
        console.log(this.state.total_users)

        button.innerHTML = buttonText;
        button.dataset.buttonState = buttonState;
    }

    render() {
        return (
            <div>
                <div className="box_of_question">
                    <div className='left_side'>
                        <div className="title_of_question1">
                            <img src={doctor} className="image_search2" alt={doctor} />
                            {this.state.first_name}&nbsp;{this.state.last_name}
                        </div>

                        <div className="infos">
                            <img src={address} className="image_search" alt={address} />

                            {this.state.address}&nbsp;{this.state.city}
                        </div>
                        <div className="infos">
                            <img src={email} className="image_search" alt={email} />

                            {this.state.email}
                        </div>
                        <div className="infos">
                            <img src={telephone} className="image_search" alt={telephone} />

                            {this.state.telephone}
                        </div>
                        <div className="infos">
                            <img src={total_users} className="image_search" alt={total_users} />

                            {this.state.total_users}
                        </div>
                    </div>
                    <div className='right_side'>
                        <Link
                            to={{ pathname: "/contactadmin" }}
                            state={{ user_id: this.state.user_id, admin_email: this.state.email,
                                admin_first_name: this.state.first_name, admin_last_name: this.state.last_name}}
                        >
                            <button type="button" className="btn_teo" data-button-state="remove">
                                Contact Professional
                            </button>
                        </Link>
                        <button id={this.state.admin}
                            type="button"
                            className="btn_teo33"
                            onClick={this.change}
                            data-button-state="report"
                        >
                            Add Professional
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
export default FeedAdmin;


