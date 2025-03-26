// WorkoutProgressBar.js
import React from 'react';
import { useExerciseCompletion } from '../ExerciseCompletionComponent/ExerciseCompletionComponent';

const WorkoutProgressBar = () => {
  const { calculateProgress } = useExerciseCompletion();
  const progress = calculateProgress();

  return (
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
  );
};

export default WorkoutProgressBar;