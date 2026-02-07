import React, { useState, useEffect } from 'react';
import { getWebsiteContacts } from '../services/contactService';
import { getBusinessHours } from '../services/businessHoursService';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaClock, FaDirections, FaMap } from 'react-icons/fa';

const WhereWeAre = () => {
  const [contacts, setContacts] = useState({
    phones: [],
    whatsapp: [],
    emails: [],
    addresses: []
  });
  const [businessHours, setBusinessHours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [mapView, setMapView] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactData, hoursData] = await Promise.all([
          getWebsiteContacts(),
          getBusinessHours()
        ]);
        
        setContacts(contactData);
        setBusinessHours(hoursData);
        
        // Set first address as selected
        if (contactData.addresses && contactData.addresses.length > 0) {
          setSelectedAddress(contactData.addresses[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddressClick = (address) => {
    setSelectedAddress(address);
    setMapView('map');
  };

  const getDirectionsUrl = (address) => {
    // Use OpenStreetMap for directions (no API key required)
    const coords = getCoordinatesFromAddress(address);
    return `https://www.openstreetmap.org/directions?from=&to=${coords.lat},${coords.lng}`;
  };

  const getCoordinatesFromAddress = (address) => {
    // This is a simplified version - in production, you'd use a geocoding API
    // For demonstration, returning approximate coordinates for different areas
    
    const addressLower = (address.city + ' ' + address.state).toLowerCase();
    
    if (addressLower.includes('bangalore') || addressLower.includes('bengaluru')) {
      return { lat: 12.9716, lng: 77.5946 };
    } else if (addressLower.includes('mumbai') || addressLower.includes('bombay')) {
      return { lat: 19.0760, lng: 72.8777 };
    } else if (addressLower.includes('delhi')) {
      return { lat: 28.6139, lng: 77.2090 };
    } else if (addressLower.includes('chennai')) {
      return { lat: 13.0827, lng: 80.2707 };
    } else if (addressLower.includes('kolkata') || addressLower.includes('calcutta')) {
      return { lat: 22.5726, lng: 88.3639 };
    }
    
    // Default to Bangalore if no match
    return { lat: 12.9716, lng: 77.5946 };
  };

  const getMapBounds = () => {
    if (contacts.addresses && contacts.addresses.length > 0) {
      const coords = contacts.addresses.map(addr => getCoordinatesFromAddress(addr));
      const lats = coords.map(c => c.lat);
      const lngs = coords.map(c => c.lng);
      
      const minLat = Math.min(...lats) - 0.1;
      const maxLat = Math.max(...lats) + 0.1;
      const minLng = Math.min(...lngs) - 0.1;
      const maxLng = Math.max(...lngs) + 0.1;
      
      return `${minLat},${minLng},${maxLat},${maxLng}`;
    }
    return '12.8716,77.4946,13.0716,77.6946'; // Default Bangalore bounds
  };

  const getMapMarkers = () => {
    if (contacts.addresses && contacts.addresses.length > 0) {
      return contacts.addresses.map((address, index) => {
        const coords = getCoordinatesFromAddress(address);
        return `${coords.lat},${coords.lng},red,${encodeURIComponent(address.street)}`;
      }).join('|');
    }
    return '12.9716,77.5946,red,MissLily Store'; // Default marker
  };

  const formatBusinessHours = (hours) => {
    if (!hours) return null;
    
    const dayNames = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    };

    const formattedHours = [];
    
    Object.entries(dayNames).forEach(([key, dayName]) => {
      const dayHours = hours[key];
      if (dayHours && dayHours.isOpen) {
        let timeString = `${dayHours.openTime} - ${dayHours.closeTime}`;
        if (dayHours.lunchBreak) {
          timeString += ` (Closed ${dayHours.lunchBreak.startTime}-${dayHours.lunchBreak.endTime})`;
        }
        formattedHours.push(`${dayName}: ${timeString}`);
      } else {
        formattedHours.push(`${dayName}: Closed`);
      }
    });

    return formattedHours;
  };

 if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Where We Are
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find our locations and get directions to visit us
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setMapView('list')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                mapView === 'list'
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaMap className="mr-2" />
              List View
            </button>
            <button
              onClick={() => setMapView('map')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                mapView === 'map'
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaMapMarkerAlt className="mr-2" />
              Map View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {mapView === 'map' ? (
                /* Map View with Static Map and Custom Markers */
                <div className="relative">
                  <div style={{ height: '500px', width: '100%', backgroundColor: '#f0f8ff' }}>
                    {/* Static Map Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50"></div>
                    
                    {/* Grid Pattern */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, transparent 70px)',
                      backgroundSize: '70px 70px'
                    }}></div>
                    
                    {/* Map Center Point */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* City Labels */}
                    <div className="absolute top-4 left-4 bg-white rounded px-2 py-1 text-xs font-semibold text-gray-700 shadow">
                      Bangalore
                    </div>
                    <div className="absolute top-4 right-4 bg-white rounded px-2 py-1 text-xs font-semibold text-gray-700 shadow">
                      India
                    </div>
                  </div>
                  
                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
                    <button
                      onClick={() => {
                        if (selectedAddress) {
                          const coords = getCoordinatesFromAddress(selectedAddress);
                          window.open(`https://www.google.com/maps?q=${encodeURIComponent(`${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}, ${selectedAddress.country}`)}`, '_blank');
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="Open in Google Maps"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0 0V6a2 2 0 00-2-2V4a2 2 0 00-2-2h-6m6 0V4a2 2 0 00-2-2V4a2 2 0 00-2-2h-6"/>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Address Markers Legend */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-2">
                    <div className="text-xs font-semibold text-gray-700 mb-1">Locations:</div>
                    <div className="flex flex-wrap gap-1">
                      {contacts.addresses.map((address, index) => (
                        <button
                          key={address.id}
                          onClick={() => setSelectedAddress(address)}
                          className={`px-2 py-1 text-xs rounded ${
                            selectedAddress?.id === address.id
                              ? 'bg-pink-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          } transition-colors`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custom Markers Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {contacts.addresses.map((address, index) => {
                      const coords = getCoordinatesFromAddress(address);
                      const isSelected = selectedAddress?.id === address.id;
                      
                      return (
                        <div
                          key={address.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                          style={{
                            left: `${((coords.lng - 77.4946) / (77.6946 - 77.4946)) * 100}%`,
                            top: `${((12.8716 - coords.lat) / (12.8716 - 13.0716)) * 100}%`,
                          }}
                        >
                          <div className={`relative group cursor-pointer transition-transform hover:scale-110 ${isSelected ? 'scale-125' : ''}`}>
                            <div className={`w-8 h-8 rounded-full border-4 ${isSelected ? 'border-pink-600 bg-pink-600' : 'border-red-500 bg-red-500'} shadow-lg`}>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <FaMapMarkerAlt className="text-white text-xs" />
                              </div>
                              {isSelected && (
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap max-w-xs">
                                  {address.street}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-pink-600" />
                    Our Locations
                  </h3>
                  <div className="space-y-4">
                    {contacts.addresses.map((address, index) => (
                      <div
                        key={address.id}
                        onClick={() => handleAddressClick(address)}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          selectedAddress?.id === address.id
                            ? 'bg-pink-50 border-pink-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                        } border`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <FaMapMarkerAlt className="text-pink-600 mt-1" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{address.street}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-sm text-gray-600">{address.country}</p>
                            {address.type && (
                              <span className="inline-block mt-1 px-2 py-1 text-xs bg-pink-100 text-pink-600 rounded-full">
                                {address.type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

       
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Selected Address Details */}
            {selectedAddress && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-pink-600" />
                  Location Details
                </h3>
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">{selectedAddress.street}</p>
                    <p className="text-gray-600">
                      {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                    </p>
                    <p className="text-gray-600">{selectedAddress.country}</p>
                  </div>
                  {selectedAddress.type && (
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <span className="inline-block px-3 py-1 text-sm bg-pink-100 text-pink-600 rounded-full">
                        {selectedAddress.type}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <a
                    href={getDirectionsUrl(selectedAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-pink-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaDirections /> Get Directions
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}, ${selectedAddress.country}`
                      );
                      alert('Address copied to clipboard!');
                    }}
                    className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                  >
                    Copy Address
                  </button>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
              
              {/* Phone Numbers */}
              {contacts.phones.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaPhone className="text-pink-600" />
                    <h4 className="font-semibold text-gray-800">Phone</h4>
                  </div>
                  <div className="space-y-2">
                    {contacts.phones.map((phone) => (
                      <a
                        key={phone.id}
                        href={`tel:${phone.number}`}
                        className="block text-gray-600 hover:text-pink-600 transition-colors"
                      >
                        {phone.number}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Email */}
              {contacts.emails.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaEnvelope className="text-pink-600" />
                    <h4 className="font-semibold text-gray-800">Email</h4>
                  </div>
                  <div className="space-y-2">
                    {contacts.emails.map((email) => (
                      <a
                        key={email.id}
                        href={`mailto:${email.email}`}
                        className="block text-gray-600 hover:text-pink-600 transition-colors"
                      >
                        {email.email}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              {contacts.whatsapp.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaWhatsapp className="text-green-600" />
                    <h4 className="font-semibold text-gray-800">WhatsApp</h4>
                  </div>
                  <div className="space-y-2">
                    {contacts.whatsapp.map((wa) => (
                      <a
                        key={wa.id}
                        href={`https://wa.me/${wa.number.replace(/[^\d]/g, '')}?text=Hi%20MissLily!%20I%20have%20a%20question.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-gray-600 hover:text-green-600 transition-colors font-medium"
                      >
                        {wa.number}
                      </a>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Click to chat on WhatsApp</p>
                </div>
              )}

              {/* Business Hours */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaClock className="text-pink-600" />
                  <h4 className="font-semibold text-gray-800">Business Hours</h4>
                </div>
                <div className="text-sm text-gray-600">
                  {businessHours ? (
                    <div className="space-y-1">
                      {formatBusinessHours(businessHours).map((hour, index) => (
                        <p key={index}>{hour}</p>
                      ))}
                      {businessHours.specialInstructions && (
                        <p className="mt-2 text-xs text-pink-600 italic">
                          {businessHours.specialInstructions}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
                      <p>Sunday: 11:00 AM - 6:00 PM</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhereWeAre;
