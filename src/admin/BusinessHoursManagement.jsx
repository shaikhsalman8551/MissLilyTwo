import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBusinessHours, saveBusinessHours, defaultBusinessHours } from '../services/businessHoursService';
import { FaClock, FaSave, FaTimes, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';

const BusinessHoursManagement = () => {
  const navigate = useNavigate();
  const [businessHours, setBusinessHours] = useState(defaultBusinessHours);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchBusinessHours = async () => {
      try {
        const existingHours = await getBusinessHours();
        if (existingHours) {
          setBusinessHours(existingHours);
        }
      } catch (error) {
        console.error('Error fetching business hours:', error);
        setErrorMessage('Failed to load business hours');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessHours();
  }, []);

  const handleDayChange = (day, field, value) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };


  const handleSpecialInstructionsChange = (value) => {
    setBusinessHours(prev => ({
      ...prev,
      specialInstructions: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await saveBusinessHours(businessHours);
      setSuccessMessage('Business hours updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving business hours:', error);
      setErrorMessage('Failed to save business hours');
    } finally {
      setSaving(false);
    }
  };

  const addLunchBreak = (day) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        lunchBreak: {
          startTime: '13:00',
          endTime: '14:00'
        }
      }
    }));
  };

  const removeLunchBreak = (day) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        lunchBreak: null
      }
    }));
  };

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];


  return (
  <>
  <AdminLayout title={"Business Hours Management"}>
            <div className="min-h-screen bg-gray-100 h-[500px]">
   
     {
        loading ? (
            <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business hours...</p>
        </div>
        ):(
    
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
       

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Weekly Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {days.map((day) => (
                <div key={day.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-medium text-gray-700">{day.label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={businessHours[day.key].isOpen}
                        onChange={(e) => handleDayChange(day.key, 'isOpen', e.target.checked)}
                        className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-600">
                        {businessHours[day.key].isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </div>

                  {businessHours[day.key].isOpen && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 w-20">Open:</label>
                        <input
                          type="time"
                          value={businessHours[day.key].openTime}
                          onChange={(e) => handleDayChange(day.key, 'openTime', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 w-20">Close:</label>
                        <input
                          type="time"
                          value={businessHours[day.key].closeTime}
                          onChange={(e) => handleDayChange(day.key, 'closeTime', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      
                      {/* Lunch Break */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Lunch Break:</span>
                        {businessHours[day.key].lunchBreak ? (
                          <button
                            type="button"
                            onClick={() => removeLunchBreak(day.key)}
                            className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                          >
                            <FaMinus /> Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addLunchBreak(day.key)}
                            className="text-pink-600 hover:text-pink-800 text-sm flex items-center gap-1"
                          >
                            <FaPlus /> Add
                          </button>
                        )}
                      </div>
                      
                      {businessHours[day.key].lunchBreak && (
                        <div className="space-y-2 pl-4 border-l-2 border-pink-200">
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 w-20">From:</label>
                            <input
                              type="time"
                              value={businessHours[day.key].lunchBreak.startTime}
                              onChange={(e) => handleDayChange(day.key, 'lunchBreak', {
                                ...businessHours[day.key].lunchBreak,
                                startTime: e.target.value
                              })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 w-20">To:</label>
                            <input
                              type="time"
                              value={businessHours[day.key].lunchBreak.endTime}
                              onChange={(e) => handleDayChange(day.key, 'lunchBreak', {
                                ...businessHours[day.key].lunchBreak,
                                endTime: e.target.value
                              })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

       

          {/* Special Instructions */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Special Instructions</h3>
            <textarea
              value={businessHours.specialInstructions}
              onChange={(e) => handleSpecialInstructionsChange(e.target.value)}
              placeholder="Add any special instructions for customers..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Business Hours
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
        )}
    </div>
    </AdminLayout>
    {/* </div> */}
    </>
  );
};

export default BusinessHoursManagement;
