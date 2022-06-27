
import React, { useState, useEffect } from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import aboutus from "../../logos/aboutus.jpeg";
import statistics from "../../logos/statistics.jpeg";
import profile from "../../logos/profile.jpeg";
import users from "../../logos/users.jpeg";

import Swal from 'sweetalert2'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, child, get, onValue } from "firebase/database";


function ChoicesBoxesBottom() {

  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [validated, setValidated] = useState(false);
  const [adminuser, setAdmin] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  
  const fullBoxUser = () => {
    return (
        <section className="choices">
            
            <div className="choice__content container container--nav container--pall">
            {/* <div className="welcome_title">Welcome to <b>MyHealth</b> user page!</div> */}
                <div className="choice__grid">
                    
                    <a href="#" className="choice__item">
                    <Link to='/aboutus'>
                        <div className="choice__image"
                             style={{backgroundImage: `url(${aboutus})`}}>
                        </div>

                        <div className="choice__text">
                            <div className="choice__title">
                                About us
                            </div>
                            <div className="choice__description">
                                Learn about our application in
                                the new Apple Watch Series 7, 
                                the importance of the measurements,
                                as well as our goal as a team.
                            </div>
                        </div>
                    </Link>
                    </a>
                    
                    <a href="#" className="choice__item">
                    <Link to='/timesearch'>
                        <div className="choice__image"
                             style={{backgroundImage: `url(${statistics})`}}>
                        </div>

                        <div className="choice__text">
                            <div className="choice__title">
                                Statistics
                            </div>
                            <div className="choice__description">
                                View general statistics about 
                                oxygen saturation and heart rate 
                                depending on gender, age etc.
                            </div>
                        </div>
                        </Link>
                    </a>

                    <a href="#" className="choice__item">
                    <Link to='/admins'>
                        <div className="choice__image"
                             style={{backgroundImage: `url(${users})`}}>
                        </div>

                        <div className="choice__text">
                            <div className="choice__title">
                                Professionals
                            </div>
                            <div className="choice__description">
                                Search-Add your professional. Authorize 
                                him to change your measurement settings
                                and send you push-notifications. 
                                View his contact information.
                            </div>
                        </div>
                        </Link>
                    </a>   
                    
                    <a href="#" className="choice__item">
                    <Link to='/profile_user'>
                        <div className="choice__image"
                             style={{backgroundImage: `url(${profile})`}}>
                        </div>

                        <div className="choice__text">
                            <div className="choice__title">
                                Profile
                            </div>
                            <div className="choice__description">
                                Change your personal information,
                                permissions, contact details and also
                                view your last measurements.
                            </div>
                        </div>
                        </Link>
                    </a>
                    
                </div>
            </div>

        </section>
    );
  }
  const fullBoxAdmin = () => {
    return (
        <section className="choices">
            
            <div className="choice__content container container--nav container--pall">
                {/* <div className="welcome_title">Welcome to <b>MyHealth</b> admin page!</div> */}
                <div className="choice__grid">
                    
                    <a href="#" className="choice__item">
                    <Link to='/aboutus'>
                        <div className="choice__image"
                             style={{backgroundImage: `url(${aboutus})`}}>
                        </div>

                        <div className="choice__text">
                            <div className="choice__title">
                                About us
                            </div>
                            <div className="choice__description">
                                Learn about our application in
                                the new Apple Watch Series 7, 
                                the importance of the measurements,
                                as well as our goal as a team.
                            </div>
                        </div>
                    </Link>
                    </a>
                    
                    <a href="#" className="choice__item">
                    <Link to='/timesearch'>
                        <div className="choice__image"
                             style={{backgroundImage: `url(${statistics})`}}>
                        </div>

                        <div className="choice__text">
                            <div className="choice__title">
                                Statistics
                            </div>
                            <div className="choice__description">
                                View general statistics about 
                                oxygen saturation and heart rate 
                                depending on gender, age etc.
                            </div>
                        </div>
                        </Link>
                    </a>

                    <a href="#" className="choice__item">
                    <Link to='/users'>
                        <div className="choice__image"
                             style={{backgroundImage: `url(${users})`}}>
                        </div>

                        <div className="choice__text">
                            <div className="choice__title">
                                Users
                            </div>
                            <div className="choice__description">
                                Search-Add users, view their last 
                                measurements and change notifications 
                                settings.
                            </div>
                        </div>
                        </Link>
                    </a>   
                    
                    <a href="#" className="choice__item">
                    <Link to='/profile_admin'>
                        <div className="choice__image"
                             style={{backgroundImage: `url(${profile})`}}>
                        </div>

                        <div className="choice__text">
                            <div className="choice__title">
                                Profile
                            </div>
                            <div className="choice__description">
                                Change your personal information,
                                permissions and contact details.
                            </div>
                        </div>
                        </Link>
                    </a>
                    
                </div>
            </div>

        </section>
    );
  }
  const fullBoxHome = () => {
    return (
        <section className="choices">
            
            <div className="choice__content container container--nav container--pall">
            {/* <div className="welcome_title">Welcome to <b>MyHealth</b>!</div> */}
                <div className="choice__grid">
                    
                    <a href="#" className="choice__item">
                    <Link to='/aboutus'>
                        <div className="choice__image"
                             style={{backgroundImage: `url(${aboutus})`}}>
                        </div>

                        <div className="choice__text">
                            <div className="choice__title">
                                About us
                            </div>
                            <div className="choice__description">
                                Learn about our application in
                                the new Apple Watch Series 7, 
                                the importance of the measurements,
                                as well as our goal as a team.
                            </div>
                        </div>
                    </Link>
                    </a>
                    
                    <a href="#" className="choice__item">
                    <Link to='/timesearch'>
                        <div className="choice__image"
                             style={{backgroundImage: `url(${statistics})`}}>
                        </div>

                        <div className="choice__text">
                            <div className="choice__title">
                                Statistics
                            </div>
                            <div className="choice__description">
                                View general statistics about 
                                oxygen saturation and heart rate 
                                depending on gender, age etc.
                            </div>
                        </div>
                        </Link>
                    </a>
                    
                </div>
            </div>

        </section>
    );
  }

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setValidated(true);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        const dbRef = ref(getDatabase());
        get(child(dbRef, `admins/${uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            setAdmin(true);
          }
          else {
            console.log("its a user");
          }
        }).catch((error) => {
          console.error(error);
        });
      }
      else {
        alert(this.validated);
        Swal.fire({
          title: 'Not authenticated',
          text: 'Please sign in',
          icon: 'info',
          customClass: "swal_ok_button",
          confirmButtonColor: "#6a98ce"
        })
        // User is signed out
        // ...
      }
    });
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  if (validated) {
    if (adminuser) {
      console.log("VALID ADMIN");
      return fullBoxAdmin();
    }
    else {
      console.log("VALID USER");
      return fullBoxUser();
    }
  }
  else {
    console.log("INVVALID");
    return fullBoxHome();
  }
}

export default ChoicesBoxesBottom;