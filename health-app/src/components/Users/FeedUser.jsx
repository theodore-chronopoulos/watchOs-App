import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import { getDatabase, ref, child, get, update, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import watch from '../../logos/watch.png';
import repeat_time from '../../logos/repeat_time.png';
import notification from '../../logos/notification.png';
import user from '../../logos/users.png';



class FeedUser extends React.Component {
    constructor(props) {
        super(props);
        this.change = this.change.bind(this);

        this.state = {
            click: true,
            admin: "",
            user_id: "",
            email: "",
            allow_notifications: "",
            measurement_counter: 0,
            repeat_time: "",
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
        get(child(dbRef, `users/${this.state.user_id}`)).then((snapshot) => {
            if (snapshot.exists()) {
                this.setState({
                    email: snapshot.val().email,
                    measurement_counter: parseInt(snapshot.val().measurement_counter),
                    repeat_time: snapshot.val().repeat_time,
                    // allow_notifications: snapshot.val().allow_notifications
                })
                if (snapshot.val().allow_notifications === "false") {
                    this.setState({
                        allow_notifications: "Disabled"
                    })
                }
                else {
                    this.setState({
                        allow_notifications: "Enabled"
                    })
                }
                // else {
                //     this.setState({
                //         users: snapshot.val().users
                //     })
                //     if (snapshot.val().users.includes(this.props.user_id)) {
                //         var button = document.getElementById([this.state.admin]);
                //         var buttonState = button.dataset.buttonState;
                //         var buttonText;
                //         var buttonState;
                //         buttonText = "Remove Professional";
                //         buttonState = "close";
                //         button.className = "btn_teo2"
                //         button.innerHTML = buttonText;
                //         button.dataset.buttonState = buttonState;
                //     }
                //     console.log(snapshot.val().users)
                // }
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
            button.className = "btn_teo2"
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
            button.className = "btn_teo"
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
                {/* <Link to={{ pathname: "/admin", state: this.state.admin.first_name }}> */}
                <div className="box_of_question">
                    <div className='left_side'>
                        <div className="title_of_question1">
                            <img src={user} className="image_search2" alt={user} />
                            {this.state.email}
                        </div>

                        <div className="infos">
                            <img src={notification} className="image_search" alt={notification} />

                            Notifications: {this.state.allow_notifications}
                        </div>
                        <div className="infos">
                            <img src={repeat_time} className="image_search" alt={repeat_time} />

                            Repeat every: {this.state.repeat_time} hours
                        </div>
                        <div className="infos">
                            <img src={watch} className="image_search" alt={watch} />

                            Number of measurements: {this.state.measurement_counter}
                        </div>
                        {/* <div className="flex">
                            {this.state.keywords.map(keyword =>
                                <div className="keyword_display" key={Math.random()}>
                                    <p>{keyword}</p>
                                </div>
                            )}
                        </div> */}
                        {/* <div className="those">
                        <div className="num_of_answers">
                            <img src={address} className="image_search" alt={address} />
                            Answers: {this.state.address}
                        </div>
                    </div> */}
                    </div>
                    <div className='right_side'>
                        <button id={this.state.admin}
                            // onclick="change()"
                            type="button"
                            className="btn_teo"
                            onClick={this.change}
                            data-button-state="report"
                        >
                            Add Professional
                        </button>
                    </div>
                </div>
                {/* </Link> */}
            </div>
        )
    }
}
export default FeedUser;