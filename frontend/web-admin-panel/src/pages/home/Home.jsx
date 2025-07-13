import './home.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import Widget from '../../components/widgets/Widget'
import Featured from '../../components/Featured/Featured'
import Chart from '../../components/chart/Chart'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Loading from '../../components/Loading/Loading';

// import TableList from '../../components/tablelist/TableList'
const Home = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for redirection
  useEffect(() => {
    const fetchDetails = async () => {
      try {
              // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem('accessToken') || "accesstokensample";

    if (!accessToken) {
      throw new Error('Access token is not available');
    }
        const response = await axios.get('https://nishan-ghimire.com.np',{
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }) 
        console.log(response.status)
        // setDetails(response.data);
      } catch (err) {
        console.log(err)
        // setError('Failed to fetch Details');
        
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchDetails();
  }, []);

  if (loading) {
    return <><Loading/></>;
  }

  if (error) {
    return <div>{error}</div>;
  }




  return (
    <div className='home'>
    <Sidebar/>
    <div className="homeContainer">
     <Navbar/>
     <div className="widgets">
      {/* <Widget type="active-user" count={details.monthlyActiveUsers || "0" }/>
      <Widget type="total-users" count={details.totalUserRegistrations || "0"}/>
      <Widget type="vendors-registered" count={details.totalVendorRegistrations || "0"}/>
      <Widget type="total-booking" count={details.totalUserLogins || "0"}/> */}
      <Widget type="active-user" count={ "0" }/>
      <Widget type="total-users" count={"0"}/>
      <Widget type="vendors-registered" count={"0"}/>
      <Widget type="total-booking" count={"0"}/>
     </div>
      <div className="charts">
        {/* <Featured totalUsers={details.totalUserRegistrations} weeklyActiveUsers={details.weeklyActiveUsers}/> */}
          <Featured totalUsers={"0"} weeklyActiveUsers={"0"}/>
        <Chart aspect={2/1} title="Booking and User traffic chart"/>
      </div>
      {/* <div className="listContainer">
        <div className="listTitle">Bookings</div>
      
      </div> */}
    </div>
    </div>
  )
}

export default Home
