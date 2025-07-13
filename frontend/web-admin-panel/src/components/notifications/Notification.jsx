import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './notification.scss'; // Ensure you have styles for this component
import NotificationsIcon from '@mui/icons-material/Notifications';
const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = async () => {
    if (!showDropdown) {
      setLoading(true);
      try {
                   // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('Access token is not available');
    }
        const response = await axios.get('http://localhost:8000/v1/admin/notifications',{
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setNotifications(response.data.data);
        setLoaded(true);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
      setLoading(false);
    }
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      <div className="item" onClick={handleToggleDropdown}>
        <NotificationsIcon className='icon' />
        {/* <div className="
        ">{notifications.length}</div> */}
      </div>
      {showDropdown && (
        <div className="notification-dropdown">
          {loading ? (
            <p>Loading...</p>
          ) : !loaded ? (
            <p>Click to load notifications</p>
          ) : notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification._id} className="notification-item">
                <p>{notification.formattedMessage}</p>
                <span>{notification.daysAgo}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
