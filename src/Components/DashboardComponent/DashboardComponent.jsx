import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaUser, FaCalendarAlt, FaChartBar, FaCalendarCheck } from 'react-icons/fa';
import { BsEyeFill, BsPencilFill, BsTrashFill, BsPlayFill, BsInfoCircle } from 'react-icons/bs';

const DashboardComponent = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const url = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const fetchWorkoutPlans = async () => {
    setLoading(true);
    setError(null);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        navigate('/login'); // Redirect to login page
        return;
      }

      const response = await axios.get(`${url}/workout/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Handle the special case where backend returns a message with plans array
      if (Array.isArray(response.data)) {
        // Normal case: Array of workout plans
        setWorkoutPlans(response.data);
      } else if (response.data.plans !== undefined) {
        // Special case: { message: string, plans: array }
        setWorkoutPlans(response.data.plans);
        setMessage(response.data.message);
      } else {
        // Handle unexpected response format
        setWorkoutPlans([]);
        setError('Unexpected response format from server');
      }
    } catch (err) {
      console.error('Error fetching workout plans:', err);
      setError(err.response?.data?.message || 'Failed to fetch workout plans.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      try {
        await axios.delete(`${url}/workout/${planId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        // Remove the deleted plan from state
        setWorkoutPlans(workoutPlans.filter(plan => plan._id !== planId));
      } catch (err) {
        console.error('Error deleting workout plan:', err);
        alert('Failed to delete workout plan. Please try again.');
      }
    }
  };

  const handleViewPlan = (planId) => {
    navigate(`/workout-plan/${planId}`);
  };

  const handleEditPlan = (planId) => {
    navigate(`/edit-workout-plan/${planId}`);
  };

  const handleCreateNewPlan = () => {
    navigate('/create-workout-plan');
  };

  const handleStartWorkout = (planId, dayIndex) => {
    navigate(`/start-workout/${planId}/${dayIndex}`);
  };

  // Format goal or level text for display
  const formatText = (text) => {
    if (!text) return '';
    return text.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get progress percentage for a plan
  const calculateProgress = (plan) => {
    if (!plan.workoutDays || plan.workoutDays.length === 0) return 0;
    
    const completedDays = plan.workoutDays.filter(day => day.completed).length;
    return Math.round((completedDays / plan.workoutDays.length) * 100);
  };

  // Find the next workout day that's not completed
  const findNextWorkoutDay = (plan) => {
    if (!plan.workoutDays) return null;
    
    const nextDay = plan.workoutDays.findIndex(day => !day.completed);
    return nextDay !== -1 ? nextDay : null;
  };

  // Loading state with a spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
        <h3 className="text-lg font-medium">Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/login')}
          className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Workout Plans</h2>
        <button 
          onClick={handleCreateNewPlan}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          + Create New Plan
        </button>
      </div>

      {/* Message from backend */}
      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-md flex items-start">
          <BsInfoCircle className="mr-2 mt-1 flex-shrink-0" />
          <p>{message}</p>
        </div>
      )}

      {/* Today's Workout Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaCalendarCheck className="mr-2 text-blue-500" />
          Today's Workouts
        </h3>
        
        {workoutPlans.length === 0 && !message && (
          <div className="bg-gray-50 p-4 rounded-md text-gray-600">
            No workouts planned for today.
          </div>
        )}
      </div>

      {workoutPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutPlans.map(plan => {
            const progress = calculateProgress(plan);
            const nextWorkoutDayIndex = findNextWorkoutDay(plan);
            
            return (
              <div key={plan._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <h3 className="text-xl font-semibold">{plan.title}</h3>
                  <p className="text-blue-100 text-sm">{plan.description}</p>
                </div>
                
                {/* Body */}
                <div className="p-4">
                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-medium text-gray-700">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Plan details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-700">
                      <FaTrophy className="mr-2 text-blue-500" /> 
                      <span>Goal: {formatText(plan.fitnessGoal)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaUser className="mr-2 text-blue-500" /> 
                      <span>Level: {formatText(plan.fitnessLevel)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaCalendarAlt className="mr-2 text-blue-500" /> 
                      <span>
                        Started: {new Date(plan.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaChartBar className="mr-2 text-blue-500" /> 
                      <span>{plan.workoutDays?.length || 0} workout days</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewPlan(plan._id)}
                      className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded"
                      title="View Plan Details"
                    >
                      <BsEyeFill />
                    </button>
                    <button 
                      onClick={() => handleEditPlan(plan._id)}
                      className="bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded"
                      title="Edit Plan"
                    >
                      <BsPencilFill />
                    </button>
                    <button 
                      onClick={() => handleDeletePlan(plan._id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded"
                      title="Delete Plan"
                    >
                      <BsTrashFill />
                    </button>
                  </div>
                  
                  {nextWorkoutDayIndex !== null && (
                    <button 
                      onClick={() => handleStartWorkout(plan._id, nextWorkoutDayIndex)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
                    >
                      <BsPlayFill className="mr-1" /> Start Next Workout
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="mx-auto h-12 w-12 text-gray-400 flex justify-center items-center">
            <FaChartBar className="text-4xl" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No workout plans</h3>
          <p className="mt-1 text-gray-500">Create a plan to start tracking your fitness journey!</p>
          <div className="mt-6">
            <button
              onClick={handleCreateNewPlan}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center"
            >
              <span className="mr-2">+</span> Create New Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardComponent;