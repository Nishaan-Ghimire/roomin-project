// AdminProfile.js
import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading/Loading';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './profile.scss';

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (

    <div className='list'>
    <Sidebar/>
    <div className="listContainer">
     <Navbar/>
    <div className="admin-profile">
      <h1>Welcome Admin</h1>
      <div className="profile-container">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy7nFdX1g_CVR4WyP5LgKOGytP0J8PE53_RQ&s"
          alt="Admin Profile"
          className="profile-image"
        />
        <div className="profile-details">
          <div className="detail-item">
            <span className="item-key">Name:</span>
            <span className="item-value">Nishan Ghimire</span>
          </div>
          <div className="detail-item">
            <span className="item-key">Email:</span>
            <span className="item-value">admin@example.com</span>
          </div>
          <div className="detail-item">
            <span className="item-key">Phone:</span>
            <span className="item-value">+1234567890</span>
          </div>
          <div className="detail-item">
            <span className="item-key">Role:</span>
            <span className="item-value">Administrator</span>
          </div>
        </div>
      </div>
    </div>

    </div>
     </div>
  );
};

export default AdminProfile;
