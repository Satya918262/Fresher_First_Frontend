import React, { useState, useEffect } from 'react'; 
 
const AnimatedCount = ({ title, end }) => { 
  const [count, setCount] = useState(0); 
  const duration = 3000; // Duration in ms (3 seconds) 
  const interval = 10; // Interval between updates in ms (smooth animation) 
 
  useEffect(() => { 
    let start = 0; 
    const step = (end - start) / (duration / interval); 
 
    const updateCounter = () => { 
      if (start < end) { 
        start += step; 
        setCount(Math.floor(start)); 
        requestAnimationFrame(updateCounter); 
      } else { 
        setCount(end); // Ensure it ends exactly at the specified value 
      } 
    }; 
 
    updateCounter(); 
  }, [end]); 
 
  return ( 
    <div style={{ textAlign: 'center', marginTop: '20px' }}> 
      <h3 className="title">{title}</h3> 
      <div 
        style={{ 
          fontSize: '30px', 
          fontWeight: 'bold', 
          color: '#007bff', 
        }} 
      > 
         {count}{title === "Placement Success Rate" ? "%" : "+"} 
      </div> 
    </div> 
  ); 
}; 
 
const AnimatedCounter = () => { 
  return ( 
    <div className="container"> 
      {/* Grid container */} 
      <div className="grid-container"> 
        <div className="grid-item"> 
          <AnimatedCount title="Students Placed" end={500} /> 
        </div> 
        <div className="grid-item"> 
          <AnimatedCount title="Companies with Us" end={50} /> 
        </div> 
        <div className="grid-item"> 
          <AnimatedCount title="Placement Success Rate" end={92} /> 
        </div> 
      </div> 
    </div> 
  ); 
}; 
 
export default AnimatedCounter;