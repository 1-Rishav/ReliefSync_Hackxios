import axios from 'axios';
import React from 'react'


  export async function CountryCenter() {
  // 1) Where is the visitor?
  const ipRes = await axios.get(import.meta.env.VITE_IPinfo);// here error
  const ipData = await ipRes.data;        // { country: "IN", loc: "12.97,77.59", … }
  const iso2   = ipData.country;
    //console.log(iso2);
  // 2) Look up that country’s centroid
  const countryRes   = await axios.get(`${import.meta.env.VITE_LatLang}/${iso2}`);
  const countryData    = await countryRes.data[0]; // REST Countries returns an array
  //console.log(countryData)        
  const [lat, lng] = countryData.latlng;              // e.g. [20, 77] for India
  return { iso2, lat, lng };                // { iso2:"IN", lat:20, lng:77 }
}


