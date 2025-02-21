import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../styles/BloodBank.scss';
import SideNav from '../dashboard/SideNav';
import bloodBankData from './data.json';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibmFyZW5kcmFucCIsImEiOiJjbTUyZGI4cHcxd2ZqMmpwN2UyNWRjMHVyIn0.Gyfvbz9a7iHJYJ5Lcst6zw';

// API key for states and districts
const API_KEY = 'WWZuYTlGbExETXhzbGtuNnJCSHNucXlzZTRLMEZHOE1uY1NZQXJ0ag==';

function BloodBank() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const markersRef = useRef([]);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [78.9629, 20.5937],
      zoom: 5
    });
  }, []);

  // Load states from API
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('https://api.countrystatecity.in/v1/countries/IN/states', {
          headers: {
            'X-CSCAPI-KEY': API_KEY
          }
        });
        const data = await response.json();
        
        // Get unique states from blood bank data
        const bloodBankStates = [...new Set(bloodBankData.map(bank => bank.State))];
        
        // Filter API states to match blood bank states
        const filteredStates = data.filter(state => 
          bloodBankStates.includes(state.name)
        );
        
        setStates(filteredStates);
      } catch (error) {
        console.error('Error fetching states:', error);
        // Fallback to blood bank data states
        const uniqueStates = [...new Set(bloodBankData.map(bank => bank.State))];
        setStates(uniqueStates.map(name => ({ name, iso2: name })));
      }
    };

    fetchStates();
  }, []);

  // Handle state selection
  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    setSelectedDistrict('');

    if (stateName) {
      // Get districts from blood bank data for selected state
      const stateDistricts = [...new Set(
        bloodBankData
          .filter(bank => bank.State === stateName)
          .map(bank => bank.District)
      )];
      setDistricts(stateDistricts.map(name => ({ name, id: name })));
    } else {
      setDistricts([]);
    }
  };

  // Handle district selection and display blood banks
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);

    if (district && selectedState) {
      displayBloodBanks(selectedState, district);
    }
  };

  // Display blood banks on map
  const displayBloodBanks = (state, district) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const filteredBanks = bloodBankData.filter(
      bank => bank.State === state && bank.District === district
    );

    if (filteredBanks.length === 0) {
      alert("No blood banks found for this location.");
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    filteredBanks.forEach(bank => {
      const marker = new mapboxgl.Marker()
        .setLngLat([bank.Longitude, bank.Latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <h3>${bank["Blood Bank Name"]}</h3>
            <p>${bank.Address}</p>
            <p>Contact: ${bank["Contact No"] || bank.Mobile || "N/A"}</p>
            <p>Category: ${bank.Category}</p>
            <p>Service Time: ${bank["Service Time"]}</p>
            ${bank["Blood Component Available"] ? `<p>Blood Components: ${bank["Blood Component Available"]}</p>` : ''}
          `)
        )
        .addTo(map.current);

      markersRef.current.push(marker);
      bounds.extend([bank.Longitude, bank.Latitude]);
    });

    map.current.fitBounds(bounds, { padding: 50 });
  };

  return (
    <div className="blood-bank-container">
      <SideNav />
      <div className="blood-bank-content">
        <h1>Blood Bank Locator</h1>
        
        <div className="controls">
          <div className="select-group">
            <label htmlFor="state">Select State:</label>
            <select
              id="state"
              value={selectedState}
              onChange={handleStateChange}
            >
              <option value="">--Select State--</option>
              {states.map(state => (
                <option key={state.name} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className="select-group">
            <label htmlFor="district">Select District:</label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={!selectedState}
            >
              <option value="">--Select District--</option>
              {districts.map(district => (
                <option key={district.name} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div ref={mapContainer} className="map-container" />
      </div>
    </div>
  );
}

export default BloodBank;
