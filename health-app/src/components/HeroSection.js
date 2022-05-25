import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className='hero-container'>
      <video src='/videos/video-2.mp4' autoPlay loop muted />
      <h1>ChargeEvolution</h1>
      <p>Charge your vehicle now!</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          buttonLink='/select_station'
        >
          Select a station
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          buttonLink='/how_to_charge'
          onClick={console.log('hey')}
        >
          How to charge <i className='far fa-play-circle' />
        </Button> 
        
      </div>
      
      
    </div>
  );
}

export default HeroSection;