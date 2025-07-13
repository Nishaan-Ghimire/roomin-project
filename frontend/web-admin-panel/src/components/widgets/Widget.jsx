import './widget.scss'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Person2Icon from '@mui/icons-material/Person2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
const Widget = ({type,count}) => {
  let data;
  switch(type){
    case "active-user":
      data = {
        title: "Monthly Active Users",
        isMoney: false,
        link: "See all users",
        icon: <Person2Icon className="icon" 
        style={{
      color:'rgba(238, 76, 76, 0.849)',
      backgroundColor: 'rgb(241, 225, 225)'
    }}/>,
      };
      break;
    case "total-users":
      data = {
        title: "Total Users Registered",
        isMoney: false,
        link: "View all orders",
        icon: <ShoppingCartIcon className="icon" style={{
          color:'rgb(94, 226, 94)',
          backgroundColor: 'rgb(241, 225, 225)'
        }}/>,
      };
      break;
    case "vendors-registered":
      data = {
        title: "Total Vendors Registered",
        isMoney: true,
        link: "View net earning",
        icon: <AttachMoneyIcon className="icon" style={{
          color:'rgb(72, 72, 224)',
          backgroundColor: 'rgb(241, 225, 225)'
        }}/>,
      };
      break;
    case "total-booking":
      data = {
        title: "Total Bookings",
        isMoney: true,
        link: "See details",
        icon: <AccountBalanceWalletIcon className="icon" style={{
          color:'rgb(62, 243, 243)',
          backgroundColor: 'rgb(241, 225, 225)'
        }}/>,
      };
      break;
      default:
        break;
  }
  return (
    <div className='widget'>
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="wcounter">{count}</span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
       
  {data.icon}
      </div>
    </div>
  )
}

export default Widget
