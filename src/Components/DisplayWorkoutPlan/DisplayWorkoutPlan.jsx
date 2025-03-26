import React from "react";

const DisplayWorkoutPlan = ({ generatedPlan, onDiscard, onSave, formData, formatGoalText, getDayColor, getDayHeaderColor }) => {
  if (!generatedPlan) return null;

  return (
    <div className="mt-4 md:mt-8 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      {/* Plan Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-0">
            {generatedPlan.title}
          </h3>

          {/* Action Buttons - Moved to top */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full shadow transition duration-300 flex items-center text-sm"
              onClick={onDiscard}
            >
              Discard
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full shadow transition duration-300 flex items-center text-sm"
              onClick={onSave}
            >
              Save Plan
            </button>
          </div>
        </div>

        <p className="opacity-90 text-sm md:text-base">
          {generatedPlan.description}
        </p>
        <div className="mt-2 md:mt-4 flex flex-wrap gap-2 text-gray-600 text-xs md:text-sm">
          <span className="px-2 py-1 bg-white bg-opacity-25 rounded-full font-medium">
            Goal: {formatGoalText(formData.fitnessGoal)}
          </span>
          <span className="px-2 py-1 bg-white bg-opacity-25 rounded-full font-medium">
            Level: {formData.fitnessLevel.charAt(0).toUpperCase() + formData.fitnessLevel.slice(1)}
          </span>
          <span className="px-2 py-1 bg-white bg-opacity-25 rounded-full font-medium">
            {formData.daysPerWeek} days/week
          </span>
        </div>
      </div>

      {/* Workout Schedule */}
      <div className="p-4 md:p-6">
        <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800 border-b pb-2">
          Your Weekly Schedule
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generatedPlan.workoutDays &&
            generatedPlan.workoutDays.map((day, index) => (
              <div
                key={index}
                className={`border-l-4 rounded-lg overflow-hidden shadow-md ${getDayColor(day.day)}`}
              >
                {/* Day Header */}
                <div className={`${getDayHeaderColor(day.day)} p-3`}>
                  <h5 className="font-bold text-base md:text-lg">{day.day}</h5>
                </div>
                {/* Exercise List */}
                <div className="divide-y divide-gray-200 bg-white">
                  {day.exercises &&
                    day.exercises.map((exercise, exerciseIndex) => (
                      <div
                        key={exerciseIndex}
                        className="p-3 hover:bg-gray-50 transition"
                      >
                        <div className="font-semibold text-sm md:text-lg text-gray-800">
                          {exercise.name}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                          <div className="flex items-center text-xs md:text-sm">
                            <span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-2 w-2 md:h-3 md:w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                />
                              </svg>
                            </span>
                            <span className="font-medium">Sets: {exercise.sets}</span>
                          </div>
                          <div className="flex items-center text-xs md:text-sm">
                            <span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-2 w-2 md:h-3 md:w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                />
                              </svg>
                            </span>
                            <span className="font-medium">Reps: {exercise.reps}</span>
                          </div>
                          {exercise.weight && (
                            <div className="flex items-center text-xs md:text-sm">
                              <span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-2 w-2 md:h-3 md:w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                                  />
                                </svg>
                              </span>
                              <span className="font-medium">Weight: {exercise.weight}</span>
                            </div>
                          )}
                        </div>
                        {exercise.notes && (
                          <div className="mt-2 pl-2 border-l-2 border-blue-300 bg-blue-50 p-2 rounded text-xs md:text-sm text-gray-700">
                            {exercise.notes}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayWorkoutPlan;