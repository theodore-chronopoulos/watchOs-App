
import React from 'react';
import Navbar from './components/Navbar';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import './App.css';
// import Home from './components/pages/Home'
// import Charge from './components/pages/Charge'
// import LoginRegister from './components/pages/LoginRegister'
// import RendezVous from './components/pages/RendezVous'
// import ChargeNow from './components/pages/ChargeNow'
// import Balance from './components/pages/Balance'
// import Profile from './components/pages/Profile'
// import Sessions from './components/pages/Sessions'


function App() {
  return (
    <>
      <Router>
      <Navbar />
      {/* <Switch>
        <Route path='/' exact component=
        {Home}/>
        <Route path='/loginregister' exact component=
        {LoginRegister}/>
        <Route path='/charge' exact component=
        {Charge}/>
        <Route path='/profile' exact component=
        {Profile}/>
        <Route path='/balance' exact component=
        {Balance}/>
        <Route path='/rendezvous' exact component=
        {RendezVous}/>
        <Route path='/chargenow' exact component=
        {ChargeNow}/>
        <Route path='/sessions' exact component=
        {Sessions}/>
      </Switch> */}
      </Router>

    </>
   
  );
}

export default App;
