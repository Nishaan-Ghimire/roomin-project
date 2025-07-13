import React from 'react';
import './PopModel.scss'; // Add your modal styles here

const PopModel = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modelOverlay" onClick={onClose}>
      <div className="modelContent" onClick={(e) => e.stopPropagation()}>
        <button className="closeButton" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default PopModel;
