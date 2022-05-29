import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Navbar.css';
import getCookie from '../functions/getCookie.js'
import Swal from 'sweetalert2'
import logoImg from "../logos/66.png";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";


function Navbar() {

  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [validated, setValidated] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  // Logout method
  function logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      Swal.fire({
        title: 'Success',
        text: 'Logout successful',
        icon: 'success',
        customClass: "swal_ok_button",
        confirmButtonColor: "#000000"
      }).then(function () {
        setValidated(false);
        window.location.href = '/';
      });
    }).catch((error) => {
      // An error happened.
      Swal.fire({
        title: 'error',
        text: 'Logout unsuccessful',
        icon: 'success',
        customClass: "swal_ok_button",
        confirmButtonColor: "#000000"
      })
    });
  }


  const fullNavbar = () => {
    return (
      <>
        <nav className='navbar'>
          <div className='navbar-container'>
            <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
              <img src={logoImg} className="logo-img" />
              ChargeEvolution
            </Link>
            <div className='menu-icon' onClick={handleClick}>
              <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
            </div>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
              <li className='nav-item'>
                <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                  Home
                </Link>
              </li>

              <li className='nav-item'>
                <Link
                  to='/charge'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Charge
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  to='/profile'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to='/'
                  className='nav-links-mobile'
                  onClick={logout}
                >
                  Log out
                </Link>
              </li>
            </ul>
            {button && <Button buttonStyle='btn--outline' onClick={logout}>Log out</Button>}
          </div>
        </nav>
      </>
    );
  }
  const halfNavbar = () => {
    return (

      <>
        <nav className='navbar'>
          <div className='navbar-container'>
            <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>

              <img src={logoImg} className="logo-img" />
              &nbsp;MyHealth

            </Link>
            <div className='menu-icon' onClick={handleClick}>
              <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
            </div>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
              <li className='nav-item'>
                <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to='/loginregister'
                  className='nav-links-mobile'
                  onClick={closeMobileMenu}
                >
                  Log in
                </Link>
              </li>
            </ul>
            {button && <Button buttonLink='/loginregister' buttonStyle='btn--outline'>Log in</Button>}
          </div>
        </nav>
      </>
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
        // ...
      } else {
        alert(this.validated);
        Swal.fire({
          title: 'Not authenticated',
          text: 'Please sign in',
          icon: 'info',
          customClass: "swal_ok_button",
          confirmButtonColor: "#000000"
        })
        // User is signed out
        // ...
      }
    });
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  if (validated) {
    console.log("VALID");
    return fullNavbar();
  }
  else {
    console.log("INVVALID");
    return halfNavbar();
  }
}

export default Navbar;