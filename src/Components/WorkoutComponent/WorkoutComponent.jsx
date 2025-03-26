
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaDumbbell, FaArrowLeft, FaArrowRight, FaCheck, FaSpinner, FaInfoCircle, FaAngleDown, FaAngleUp } from 'react-icons/fa';

const WorkoutComponent = () => {
  const { planId, dayIndex } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [currentDay, setCurrentDay] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [showExerciseDetails, setShowExerciseDetails] = useState(false);
  const url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchWorkoutPlan();
  }, [planId, dayIndex]);

  const fetchWorkoutPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${url}/workout/${planId}/${dayIndex}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setWorkoutPlan(response.data);
      
      if (response.data.workoutDays && response.data.workoutDays[dayIndex]) {
        setCurrentDay(response.data.workoutDays[dayIndex]);
        // Initialize completed exercises based on data from server
        const completionStatus = response.data.workoutDays[dayIndex].exercises.map(
          exercise => exercise.completed || false
        );
        setCompletedExercises(completionStatus);
      } else {
        setError(`Workout day not found for index: ${dayIndex}`);
      }
    } catch (err) {
      console.error('Error fetching workout plan:', err);
      setError(err.response?.data?.message || 'Failed to fetch workout plan.');
    } finally {
      setLoading(false);
    }
  };

  const markExerciseComplete = async (exerciseIndex) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return false;
      }

      await axios.post(`${url}/workout/mark-complete/`, {
        planId,
        dayIndex,
        exerciseIndex
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      const newCompletedExercises = [...completedExercises];
      newCompletedExercises[exerciseIndex] = true;
      setCompletedExercises(newCompletedExercises);
      
      return true;
    } catch (err) {
      console.error('Error marking exercise as complete:', err);
      alert('Failed to mark exercise as complete. Please try again.');
      return false;
    }
  };

  const markExerciseIncomplete = async (exerciseIndex) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return false;
      }

      await axios.post(`${url}/workout/mark-incomplete`, {
        planId,
        dayIndex,
        exerciseIndex
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      const newCompletedExercises = [...completedExercises];
      newCompletedExercises[exerciseIndex] = false;
      setCompletedExercises(newCompletedExercises);
      
      return true;
    } catch (err) {
      console.error('Error marking exercise as incomplete:', err);
      alert('Failed to mark exercise as incomplete. Please try again.');
      return false;
    }
  };

  const toggleExerciseCompletion = async (index) => {
    if (completedExercises[index]) {
      return await markExerciseIncomplete(index);
    } else {
      return await markExerciseComplete(index);
    }
  };

  const handleCompleteExercise = async () => {
    const success = await markExerciseComplete(currentExerciseIndex);
    
    // Move to next exercise if not at the end and if operation was successful
    if (success && currentExerciseIndex < currentDay.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < currentDay.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleFinishWorkout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${url}/workout/${planId}/complete-day/${dayIndex}`, {},{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error completing workout:', err);
      alert('Failed to mark workout as complete. Please try again.');
    }
  };

  const calculateProgress = () => {
    if (!completedExercises.length) return 0;
    const completedCount = completedExercises.filter(Boolean).length;
    return Math.round((completedCount / completedExercises.length) * 100);
  };

  const checkForMissedWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      console.log(token)

      await axios.get(`${url}/workout/check-missed`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Error checking missed workouts:', err);
    }
  };

  // Run once when component mounts
  useEffect(() => {
    checkForMissedWorkouts();
  }, []);

  // Simple exercise demonstration component
  const ExerciseDemonstration = ({ exercise }) => {
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-lg mb-2">How to perform: {exercise.name}</h4>
        
        <div className="flex justify-center items-center mb-4">
          {/* Stick figure representation */}
          <svg viewBox="0 0 100 120" width="120" height="120">
            {/* Head */}
            <circle cx="50" cy="20" r="10" fill="none" stroke="#3B82F6" strokeWidth="2" />
            
            {/* Body */}
            <line x1="50" y1="30" x2="50" y2="70" stroke="#3B82F6" strokeWidth="2" />
            
            {/* Arms */}
            <line x1="50" y1="45" x2="30" y2="60" stroke="#3B82F6" strokeWidth="2" />
            <line x1="50" y1="45" x2="70" y2="60" stroke="#3B82F6" strokeWidth="2" />
            
            {/* Legs */}
            <line x1="50" y1="70" x2="35" y2="100" stroke="#3B82F6" strokeWidth="2" />
            <line x1="50" y1="70" x2="65" y2="100" stroke="#3B82F6" strokeWidth="2" />
          </svg>
        </div>
        
        <div className="text-sm">
          <h5 className="font-medium">Instructions:</h5>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Stand with proper form and posture</li>
            <li>Perform the movement with controlled motion</li>
            <li>Focus on muscle engagement throughout</li>
            <li>Breathe properly during the exercise</li>
          </ul>
          
          {exercise.notes && (
            <div className="mt-3 p-3 bg-blue-50 text-blue-800 rounded">
              <strong>Notes:</strong> {exercise.notes}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
        <h3 className="text-lg font-medium">Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!workoutPlan || !currentDay) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-medium">Workout not found</h3>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentExercise = currentDay.exercises[currentExerciseIndex];
  const progress = calculateProgress();
  const allExercisesCompleted = completedExercises.every(Boolean);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{workoutPlan.title}</h2>
          <p className="text-gray-600">{currentDay.day} Workout</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="mr-1 inline" /> Back
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Workout Progress</span>
          <span className="text-sm font-medium text-gray-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Current Exercise */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-6">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              Exercise {currentExerciseIndex + 1}/{currentDay.exercises.length}
            </h3>
            <span className="bg-white text-blue-600 px-2 py-1 rounded text-sm font-medium">
              {completedExercises[currentExerciseIndex] ? 'Completed' : 'In Progress'}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h4 className="text-lg font-medium mb-1">{currentExercise.name}</h4>
          
          <div className="flex items-center space-x-4 text-gray-700 mb-4">
            <div className="bg-gray-100 px-3 py-1 rounded">
              <FaDumbbell className="inline mr-1 text-blue-500" /> 
              {currentExercise.sets} sets
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded">
              {currentExercise.reps} reps
            </div>
          </div>
          
          {currentExercise.notes && (
            <p className="text-gray-600 mb-4">{currentExercise.notes}</p>
          )}
          
          <div className="mt-2">
            <button
              onClick={() => setShowExerciseDetails(!showExerciseDetails)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaInfoCircle className="mr-1" />
              {showExerciseDetails ? 'Hide Demo' : 'Show Demo'} 
              {showExerciseDetails ? <FaAngleUp className="ml-1" /> : <FaAngleDown className="ml-1" />}
            </button>
            
            {showExerciseDetails && (
              <div className="mt-4">
                <ExerciseDemonstration exercise={currentExercise} />
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button 
            onClick={handlePreviousExercise}
            disabled={currentExerciseIndex === 0}
            className={`px-4 py-2 rounded-md flex items-center ${
              currentExerciseIndex === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaArrowLeft className="mr-1" /> Previous
          </button>
          
          <button 
            onClick={handleCompleteExercise}
            disabled={completedExercises[currentExerciseIndex]}
            className={`px-4 py-2 rounded-md flex items-center ${
              completedExercises[currentExerciseIndex]
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <FaCheck className="mr-1" /> 
            {completedExercises[currentExerciseIndex] ? 'Completed' : 'Mark Complete'}
          </button>
          
          <button 
            onClick={handleNextExercise}
            disabled={currentExerciseIndex === currentDay.exercises.length - 1}
            className={`px-4 py-2 rounded-md flex items-center ${
              currentExerciseIndex === currentDay.exercises.length - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Next <FaArrowRight className="ml-1" />
          </button>
        </div>
      </div>

      {/* Exercise List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium">All Exercises</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {currentDay.exercises.map((exercise, index) => (
            <div 
              key={exercise._id || index} 
              className={`p-3 flex justify-between items-center cursor-pointer ${
                currentExerciseIndex === index ? 'bg-blue-50' : ''
              }`}
              onClick={() => setCurrentExerciseIndex(index)}
            >
              <div className="flex items-center">
                <span 
                  className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                    completedExercises[index] 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExerciseCompletion(index);
                  }}
                >
                  {completedExercises[index] ? <FaCheck size={12} /> : index + 1}
                </span>
                <span className={completedExercises[index] ? 'text-gray-500 line-through' : ''}>
                  {exercise.name}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {exercise.sets} × {exercise.reps}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Finish Workout Button */}
      <div className="text-center mb-8">
        <button
          onClick={handleFinishWorkout}
          disabled={!allExercisesCompleted}
          className={`px-6 py-3 rounded-md text-white font-medium ${
            allExercisesCompleted 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Finish Workout
        </button>
        
        {!allExercisesCompleted && (
          <p className="text-sm text-gray-500 mt-2">
            Complete all exercises to finish the workout
          </p>
        )}
      </div>
    </div>
  );
};

export default WorkoutComponent;