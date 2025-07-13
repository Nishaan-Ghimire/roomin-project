import './requests.scss'
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import VerificationRequest from '../../components/verification-request/VerificationRequest';
const Requests = ({type}) => {
  return (
    <div className='list'>
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="verificationRequestContainer">
          <VerificationRequest />
        </div>
      </div>
    </div>
  )
}

export default Requests
