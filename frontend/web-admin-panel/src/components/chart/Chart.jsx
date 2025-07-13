import './chart.scss'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Chart = ({ aspect, title }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
         // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('Access token is not available');
    }
        const response = await axios.get('https://stingray-app-ye7j7.ondigitalocean.app/v1/admin/analytics/booking-details',{
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const monthlyBookings = response.data.monthlyBookings;
        const monthlyActiveUsers = response.data.monthlyActiveUsers;

        // Convert the response data to the format required by the chart
        const chartData = Object.keys(monthlyBookings).map(month => ({
          name: month,
          booking: monthlyBookings[month],
          activeUsers: monthlyActiveUsers[month]
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='chart'>
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="booking" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="activeUsers" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart;


// traffic: Math.floor(Math.random() * 100),