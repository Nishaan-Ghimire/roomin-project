// Spinner.js
import React from 'react';
import './loading.scss';

const Loading = () => {
  return (
    <div className="spinner-container">
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
    </div>
  );
};

export default Loading;
