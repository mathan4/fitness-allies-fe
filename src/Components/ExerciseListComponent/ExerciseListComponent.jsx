// ExerciseList.js
import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { useExerciseCompletion } from '../ExerciseCompletionComponent/ExerciseCompletionComponent';

const ExerciseList = ({ 
  planId, 
  dayIndex, 
  exercises, 
  currentExerciseIndex, 
  setCurrentExerciseIndex 
}) => {
  const { completedExercises, toggleExerciseCompletion } = useExerciseCompletion();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-6">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium">All Exercises</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {exercises.map((exercise, index) => (
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
                  toggleExerciseCompletion(planId, dayIndex, index);
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
  );
};

export default ExerciseList;