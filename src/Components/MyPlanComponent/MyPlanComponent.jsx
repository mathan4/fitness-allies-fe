import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyPlanComponent = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]); // Ensure initial state is an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${url}/api/v1/fitnessAllies/workout/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Ensure response data is an array before setting it to state
        console.log(response.data)
        const plans = Array.isArray(response.data) ? response.data : [];
        setWorkoutPlans(plans);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkoutPlans();
  }, []);

  if (loading) return <div className="text-center text-lg font-semibold">Loading workout plans...</div>;
  if (error) return <div className="text-red-600 font-semibold">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center md:text-left">My Workout Plans</h2>
      {workoutPlans.length === 0 ? (
        <p className="text-lg text-center">You haven't created any workout plans yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workoutPlans.map(plan => (
            <div key={plan._id} className="bg-white shadow-md rounded-lg p-4 md:p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-semibold">{plan.title}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded ${plan.active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {plan.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700">{plan.description}</p>
                <div className="mt-4 space-y-1 text-sm md:text-base">
                  <div><strong>Goal:</strong> {plan.fitnessGoal.replace('_', ' ')}</div>
                  <div><strong>Level:</strong> {plan.fitnessLevel}</div>
                  <div><strong>Duration:</strong> {new Date(plan.startDate).toLocaleDateString()} to {new Date(plan.endDate).toLocaleDateString()}</div>
                  <div><strong>Workout Days:</strong> {plan.workoutDays.length} per week</div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Schedule</h4>
                {plan.workoutDays.map(workout => (
                  <div key={workout._id} className="mb-3">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">{workout.day}</h5>
                      {workout.completed && <span className="text-sm font-medium text-green-600">Completed</span>}
                    </div>
                    
                    <div className="ml-4 mt-2 space-y-1">
                      {workout.exercises.map((exercise, index) => (
                        <div key={exercise.exerciseId} className="text-sm">
                          <div className="font-medium">{index + 1}. {exercise.name}</div>
                          <div className="text-gray-600">
                            {exercise.sets} sets × {exercise.reps} {exercise.name.toLowerCase().includes('cardio') ? 'minutes' : 'reps'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-4">
                <button className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm md:text-base">Start Workout</button>
                <button className="bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300 text-sm md:text-base">Edit Plan</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPlanComponent;
