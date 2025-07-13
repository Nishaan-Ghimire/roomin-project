
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
// import New from "./pages/new/New";
import Profile from "./pages/profile/Profile"


import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import './style/dark.scss'
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext.jsx";
import { isAuthenticated } from './utils/Auth.js';
import Requests from "./components/requests/Requests"
import Verification_detail from "./components/verification_detail/Verification_detail";
// const Inputs = require('./formSource');


function App() {
  const {darkMode} = useContext(DarkModeContext)
  return (
    <div className={darkMode ? "app dark" : "app"}>
     <BrowserRouter>
 <Routes>
   <Route path='/'>
     {/* <Route index element={<Login/>}/> */}
       <Route index element={<Home/>}/>
     {/* <Route  path='dashboard' element={isAuthenticated() ? <Home /> : <Navigate to="/" />}/> */}
     <Route  path='profile' element={isAuthenticated() ? <Profile /> : <Navigate to="/" />}/>
 
     <Route path="users">
     <Route index element={isAuthenticated() ? <List type="users"/>: <Navigate to="/" />}/>
     <Route  path=':userId' element={isAuthenticated() ? <Single/>: <Navigate to="/" />}/>
     {/* <Route  path='new' element={<New inputs={Inputs.userInputs} title={'Add new User'}/>}/> */}
   </Route>

   <Route path="verification-request">
     <Route index element={isAuthenticated() ? <Requests/>: <Navigate to="/" />}/>
     <Route  path=':userId' element={isAuthenticated() ? <Verification_detail/>: <Navigate to="/" />}/>
     {/* <Route  path='new' element={<New inputs={Inputs.productInputs} title={'Add new Products'}/>}/> */}
   </Route>

   </Route>

 </Routes>
 
 </BrowserRouter>
    </div>
  );
}

export default App;

