import './navbar.scss'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { Link } from 'react-router-dom';
import NotificationDropdown from '../../components/notifications/Notification';
const Navbar = () => {
  const {dispatch} = useContext(DarkModeContext);
  return (
    <>
      <div className="navbar">
        <div className="wrapper">
            <div className="search">
                <input type="text" name="search" placeholder='Search...'/>
                <SearchOutlinedIcon/>
            </div>
            <div className="items">
               
                <div className="item">
                <DarkModeIcon className='icon' onClick={()=>{
                  dispatch({type: "TOGGLE"});
                }}/>
                </div>
                
                <div className="item">
                <FullscreenExitIcon className='icon' />
                </div>
                
                <div className="item">
                {/* <NotificationsIcon className='icon' /> */}
                <NotificationDropdown />
                {/* <div className="counter"></div> */}
                </div>
                
              
                
             
                <div className="item">
                <Link to="/profile" className='sidelink'>
               <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy7nFdX1g_CVR4WyP5LgKOGytP0J8PE53_RQ&s" alt="avatar" className='avatar' />
                
               </Link>
               </div>
                
                
            </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
