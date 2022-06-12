import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import { getDatabase, ref, child, get, update } from "firebase/database";
import address from '../../logos/address.png';
import telephone from '../../logos/telephone.png';
import email from '../../logos/email.png';
import doctor from '../../logos/doctor.png';



class FeedAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            click: true,
            admin: "",
            first_name: "",
            last_name: "",
            address: "",
            city: "",
            telephone: "",
            email: ""
        };
    }
    async componentDidMount() {
        console.log(this.props)
        await this.setState({
            admin: this.props.admin,
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
                    email: snapshot.val().email
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
                {/* <Link to={{ pathname: "/admin", state: this.state.admin.first_name }}> */}
                <div className="box_of_question">

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
                {/* </Link> */}
            </div>
        )
    }
}
export default FeedAdmin;