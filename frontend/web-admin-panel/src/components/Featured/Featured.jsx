import './featured.scss';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CircularProgressbar } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
const Featured = ({totalUsers,weeklyActiveUsers}) => {
    // const totalusers = 2300
    // const weeklyactiveusers = 124
 
    return (
        <div className='featured'>
            <div className="top">
                <h1 className="title">Weekly Active users</h1>
            <MoreVertIcon/>
            </div>
            <div className="bottom">
        <div className="featuredChart">
        <CircularProgressbar value={((weeklyActiveUsers/totalUsers)*100)?((weeklyActiveUsers/totalUsers)*100):0} text={Math.floor(((weeklyActiveUsers/totalUsers)*100)?((weeklyActiveUsers/totalUsers)*100):0)+'%'} strokeWidth={5}/>
        </div>
        <p className="title">Most active users</p>
        <p className="amount">{weeklyActiveUsers}</p>
       
           <div className="summary">
            <div className="item">
               
                
            </div>
            <div className="item">
                <div className="itemTitle"> Weekly Active User</div>
                <div className="itemResult">
                    {/* <KeyboardArrowUpIcon fontSize='small'/> */}
                    <div className="resultAmount">{weeklyActiveUsers}</div>
                    
                </div>
                
            </div>
            <div className="item">
                <div className="itemTitle">Monthly Active User</div>
                <div className="itemResult">
                    {/* <KeyboardArrowUpIcon fontSize='small'/> */}
                    <div className="resultAmount">{weeklyActiveUsers}</div>
                    
                </div>
                
            </div>
           </div>
            </div>
        </div>
    )
}

export default Featured
