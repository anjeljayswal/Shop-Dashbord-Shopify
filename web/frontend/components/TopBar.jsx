import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'


export function TopBar() {
  // let fetch = useAuthenticatedFetch();
  const [storeName, setStoreName]=useState("");
  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const response = await fetch('/api/store/info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log("response", data);
        setStoreName(data.data[0].name);
      } catch (error) {
        console.error('Error fetching store info:', error);
      }
    };
    fetchStoreInfo();
  }, []);
  console.log("store name", storeName);
  
  return (
    <div className='topbar-section'>
        <div className="logo-block">
            <img className='logo' src="../assets/logo.png" alt="logo image" />
            <h1 className='text-bold h4 capitalize'>{storeName}</h1>
            <NavLink to="/"> Sales </NavLink>
            <NavLink to="/products"> Products </NavLink>
        </div>
    </div>
  )
}