import './verificationRequest.scss';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerificationRequest = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
              // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('Access token is not available');
    }
        const response = await axios.get('https://stingray-app-ye7j7.ondigitalocean.app/v1/admin/pendingkyc',{
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const userData = response.data.map(user => ({
          id: user._id,
          email: user.email,
          username: user.username,
          kyc_status: user.kyc_status
        }));
        setUsers(userData);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'username', headerName: 'Username', width: 200 },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/verification-request/${params.row.id}`}>
              <div className="viewButton">View</div>
            </Link>
            {/* <div className="rejectButton">Reject</div>
            <div className="cancelButton">Cancel</div> */}
          </div>
        );
      }
    }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='datatable'>
      {/* <div className="dataTableTitle">
        Add New User 
        <Link to="/users/new" className='addnew'>Add</Link>
      </div> */}
      <DataGrid
        className='datagrid'
        rows={users}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        // checkboxSelection
      />
    </div>
  )
}

export default VerificationRequest;














// import './datatable.scss';
// import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
// import { userColumns,userRows } from '../../datatablesource';
// import { Link } from 'react-router-dom';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Datatable = () => {





  
//   const actionColumn = [
// {
//   field: "action",
//   headerName: "Action",
//   width: 200,
//   renderCell: ()=>{
//     return(
//       <div className="cellAction">
//         <Link to="joe">
          
//         <div className="viewButton">View</div>
//         </Link>
//         <div className="deleteButton">Delete</div>
//       </div>
//     );
//   }
// }

//   ];

//   return (
//     <div className='datatable'>
//       <div className="dataTableTitle">
//         Add new user 
//         <Link to="/users/new" className='addnew'>Add</Link>
//       </div>
//          <DataGrid
//          className='datagrid'
//         rows={userRows}
//         columns={userColumns.concat(actionColumn)}
//         pageSize={10}
//         rowsPerPageOptions={[10]}
//         checkboxSelection
//       />
//     </div>
//   )
// }

// export default Datatable
