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
        console.log(this.props.user_id)
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
            }
            else {
                console.log("No data available");
                // window.location.href = '/';
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    change() {
        const auth = getAuth();

        var button = document.getElementById([this.state.user_id]);
        var buttonState = button.dataset.buttonState;
        // var button.className;

        if (buttonState === 'remove') {
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
    }

    render() {
        const backUrl = '/some/other/value'
        const newTo = {
            pathname: "/user",
            param1: "Par1"
        };

        return (
            <div>
                <Link
                    to={{
                        pathname: "/user",
                        // search: this.state.user_id,
                        // hash: this.state.user_id,
                        // state: { string: this.state.user_id }
                    }}
                    state={{user_id: this.state.user_id}}
                >

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
                        </div>
                        <div className='right_side'>
                            <button id={this.state.user_id}
                                type="button"
                                className="btn_teo4"
                                onClick={this.change}
                                data-button-state="remove"
                            >
                                Remove User
                            </button>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }
}
export default FeedUser;