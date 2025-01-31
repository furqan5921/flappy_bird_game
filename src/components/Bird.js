import React from 'react';
import '../App.css';

const Bird = ({ birdPosition }) => {
  return <div className="bird" style={{ top: birdPosition, left: 50 }} />;
};

export default Bird;