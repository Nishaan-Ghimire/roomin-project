import './sidebar.scss'
import DashboardIcon from '@mui/icons-material/Dashboard';
import Person2Icon from '@mui/icons-material/Person2';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import FilterFramesIcon from '@mui/icons-material/FilterFrames';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const {dispatch} = useContext(DarkModeContext);
    const navigate = useNavigate();

    const logout = () => {
      // Remove tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
  
      // Remove tokens from cookies
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
      // Redirect to home page
      navigate('/');
    };
  
  return (
    <>
   <div className="sidebar">
    <div className="top">
    <Link to="/" className='sidelink'>

        <span className="logo">
             Roomin Admin
        </span>
    </Link>
    </div>
    <hr />
    <div className="center">
        <ul>
           
            <li>
            <Link to="/dashboard"className='sidelink'>

                <DashboardIcon className='icon'/>
                <span>Dashboard</span>
            </Link>
            </li>
        
            <li>
                <Link to="/users" className='sidelink'>
                <Person2Icon className='icon' />
                <span>Users</span>
                </Link>
                    
            </li>

            <li>
            <Link to="/verification-request" className='sidelink'>

                <ProductionQuantityLimitsIcon className='icon' />
                <span>Vendors</span>
            </Link>
            </li>
            
            <li>
            <Link to="/profile" className='sidelink'>
                <AccountCircleIcon className='icon' />
                <span>Profile</span>
                </Link>
            </li>

            <li onClick={logout}>
          <LogoutIcon className="icon" />
          <span>Logout</span>
        </li>

            <li>
                <span>Color options</span>
            </li>
        </ul>
    </div>
  <div className="bottom">
    <div className="colorOption" onClick={()=>{
        dispatch({type: "LIGHT"})
    }}></div>
    <div className="colorOption" onClick={()=>{
        dispatch({type: "DARK"})
    }}></div>
  </div>
   </div>
    </>
  )
}

export default Sidebar
