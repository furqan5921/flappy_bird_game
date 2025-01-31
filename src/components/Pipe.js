import React from 'react';
import '../App.css';

const Pipe = ({ pipe }) => {
    return (
        <>
            <div className="pipe top" style={{ left: pipe.x, width: 50, height: pipe.topHeight }} />
            <div className="pipe bottom" style={{ left: pipe.x, height: pipe.bottomHeight, top: 600 - pipe.bottomHeight }} />
        </>
    );
};

export default Pipe;