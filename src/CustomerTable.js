// frontend/src/components/CustomerTable.js
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://zithara-backend.vercel.app/api', // Replace with your base API URL
 // baseURL: 'http://localhost:5000/api', // Replace with your base API URL
});

function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameQuery, setNameQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/customers?page=${currentPage}`);
console.log(response)
const customersWithSerial = response.data.map((customer, index) => ({
    ...customer,
    serial: index + 1
  }));
       setCustomers(customersWithSerial);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
      setLoading(false);
    };

    fetchCustomers();
  }, [currentPage]);

 
  // Function to format date
  const formatDate = (row) => new Date(row.created_at).toLocaleDateString();
  
  // Function to format time
  const formatTime = (row) => new Date(row.created_at).toLocaleTimeString();
// Define columns array with functions for selector
const columns = [
    {
      name: 'Sno',
      selector: row => row.serial,
    },  {
      name: 'Customer Name',
      selector: row => row.customer_name,
    },
    {
      name: 'Age',
      selector: row => row.age,
    },
    {
      name: 'Phone',
      selector: row => row.phone,
    },
    {
      name: 'Location',
      selector: row => row.location,
    },
    {
        name: 'Date',
        selector: row => formatDate(row),
        sortable: true,
        sortFunction: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      },
      {
        name: 'Time',
        selector: row => formatTime(row),
        sortable: true,
        sortFunction: (a, b) => {
          const timeA = new Date(a.created_at).getTime();
          const timeB = new Date(b.created_at).getTime();
          return timeA - timeB;
        },
      }
      
  ];
  const filteredCustomers = customers.filter(
    customer =>
      customer.customer_name.toLowerCase().includes(nameQuery.toLowerCase()) &&
      customer.location.toLowerCase().includes(locationQuery.toLowerCase())
  );

  return (
    <div className='container'>
        <div className='container'>
      <div className="card">
         <div className="input-group">
          <input
            type="text"
            placeholder="Search by name"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
          />  
          <input
            type="text"
            placeholder="Search by location"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />
        </div>

        <div className="table-container">
          <DataTable
            columns={columns}
            data={filteredCustomers}
            progressPending={loading}
            pagination
            paginationPerPage={20}
            paginationTotalRows={filteredCustomers.length} // Specify total rows for pagination
            onChangePage={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
</div>
  );
}

export default CustomerTable;
