import './verification_detail.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Chart from '../../components/chart/Chart';
import TableList from '../../components/tablelist/TableList';
import { useParams,useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import PopModel from '../popmodel/PopModel'

// import { Button } from '@mui/material';
const Verification_detail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const navigate = useNavigate(); // Hook for redirection

  const openModel = () => setIsModelOpen(true);
  const closeModel = () => setIsModelOpen(false);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
          throw new Error('Access token is not available');
        }
        const response = await axios.get(`https://stingray-app-ye7j7.ondigitalocean.app/v1/admin/user-detail/${userId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        console.log(response.data.user)
        setUser(response.data.user);
        setBookings(response.data.bookings);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchUserDetails();
  }, [userId,notification,notificationType]);



  const handleVerificationAction = async (status) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        throw new Error('Access token is not available');
      }

      const response = await axios.post(
        'https://stingray-app-ye7j7.ondigitalocean.app/v1/admin/verify-hostel',
        { user_id:userId, status },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.status === 200) {
        setNotification(`Hostel verification status updated to ${status}.`);
        setNotificationType('success');
        navigate('/verification-request');
      } else {
        throw new Error('Failed to update hostel verification status.');
      }
    } catch (error) {
      console.error('Error updating verification status:', error);
      setNotification('Failed to update hostel verification status.');
      setNotificationType('error');
    } finally {
      setTimeout(() => {
        setNotification('');
        setNotificationType('');
      }, 5000);
    }
  };








  if (loading) {
    return <><Loading /></>;
  }

  return (
    <div className='single'>
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        {notification && (
  <div className={`notification ${notificationType} show`}>
    {notification}
  </div>
)}
        <div className="top">
          <div className="left">
            {/* <div className="editButton">Edit</div> */}
            <h1 className="title">User Information</h1>
            <div className="item">
              <img
                //   user?.profileImage || 
                src={"/media/profile-default.svg"}
                alt="profile pic"
                className='itemImg'
              />
              <div className="details">
                <h1 className="itemTitle">{user?.fullName || "N/A"}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email: </span>
                  <span className="itemValue">{user?.email || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone: </span>
                  <span className="itemValue">{user?.phoneNo || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Age: </span>
                  <span className="itemValue">{user?.age || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Status: </span>
                  <span className="itemValue">{user?.kyc_status || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <button className='recoverBtn green' onClick={() => handleVerificationAction('Accept')}>Accept</button>
                  <button className='recoverBtn yellow' onClick={() => handleVerificationAction('Reject')}>Reject</button>
                  {/* <button className='recoverBtn red' onClick={() => handleVerificationAction('Cancel')}>Cancel</button> */}
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="bottom">
          <div className="title">KYC Document</div>
          <div className="kyc-documents">

            <div className="verificationRequest">
              <img src={user?.kyc_documents.hostel_certificate ||"https://via.placeholder.com/400x300.png?text=KYC+Document+1"} alt="KYC Document" onClick={openModel} className="thumbnail" />

              <PopModel isOpen={isModelOpen} onClose={closeModel}>
                <img src={user?.kyc_documents.pan_card || "https://via.placeholder.com/400x300.png?text=KYC+Document+1"} alt="KYC Document" className="fullImage" />
              </PopModel>
              <img src={user?.kyc_documents.pan_card || "https://via.placeholder.com/400x300.png?text=KYC+Document+1"} alt="KYC Document" onClick={openModel} className="thumbnail" />

              <PopModel isOpen={isModelOpen} onClose={closeModel}>
                <img src={user?.kyc_documents.pan_card || "https://via.placeholder.com/400x300.png?text=KYC+Document+1"} alt="KYC Document" className="fullImage" />
              </PopModel>
            </div>



          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification_detail;
