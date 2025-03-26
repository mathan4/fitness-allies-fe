import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create context
const ExerciseCompletionContext = createContext();

// Custom hook to use the context
export const useExerciseCompletion = () => {
  return useContext(ExerciseCompletionContext);
};

// Provider component
export const ExerciseCompletionProvider = ({ children }) => {
  const [completedExercises, setCompletedExercises] = useState([]);
  const url = import.meta.env.VITE_BASE_URL;

  // Initialize completion status based on exercises array
  const initializeCompletionStatus = (exercises) => {
    // Create an array of boolean values indicating completion status
    return exercises.map((exercise) => exercise.completed || false);
  };

  // Mark an exercise as complete
  const markExerciseComplete = async (planId, dayIndex, exerciseIndex) => {
    try {
      const token = localStorage.getItem("token");

      // Make API call to update completion status on the server
      const response = await axios.post(
        `${url}/api/v1/fitnessAllies/workout/mark-complete`,
        { planId, dayIndex }, // Make sure you're sending these as part of the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      const updatedCompletedExercises = [...completedExercises];
      updatedCompletedExercises[exerciseIndex] = true;
      setCompletedExercises(updatedCompletedExercises);

      return true; // Indicate success
    } catch (error) {
      console.error("Error marking exercise as complete:", error);
      return false; // Indicate failure
    }
  };

  // Calculate current progress percentage
  const calculateProgress = () => {
    if (completedExercises.length === 0) return 0;

    const completedCount = completedExercises.filter(Boolean).length;
    return Math.round((completedCount / completedExercises.length) * 100);
  };

  // Define the context value
  const contextValue = {
    completedExercises,
    setCompletedExercises,
    initializeCompletionStatus,
    markExerciseComplete,
    calculateProgress,
  };

  return (
    <ExerciseCompletionContext.Provider value={contextValue}>
      {children}
    </ExerciseCompletionContext.Provider>
  );
};
