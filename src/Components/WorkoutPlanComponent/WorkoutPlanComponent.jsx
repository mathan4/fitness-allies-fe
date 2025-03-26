import React, { useState } from "react";
import FormComponent from "../FormComponent/FormComponent";
import DisplayWorkoutPlan from "../DisplayWorkoutPlan/DisplayWorkoutPlan";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../ModalComponent/ModalComponent";

const WorkoutPlanComponent = () => {
  const [formData, setFormData] = useState({
    fitnessGoal: "",
    fitnessLevel: "",
    availableTime: "",
    daysPerWeek: 3, // Default value
    availableEquipment: [], // Array of equipment
    focusAreas: [], // Array of body areas
    excludedExercises: [], // Array of exercise IDs
    injuries: [], // Array of injury descriptions
    planName: "My Workout Plan", // Default plan name
  });
  const url = import.meta.env.VITE_BASE_URL;
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const navigate=useNavigate()

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true)
  };

  const handleCloseModal = () => {
    setShowModal(false)
    navigate('/dashboard')
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle array-based inputs
    if (name.includes(".")) {
      const [arrayName, index] = name.split(".");
      const updatedArray = [...formData[arrayName]];
      updatedArray[index] = value;
      setFormData({
        ...formData,
        [arrayName]: updatedArray,
      });
    }
    // Handle checkbox inputs for multi-select options
    else if (type === "checkbox" && Array.isArray(formData[name])) {
      const updatedArray = checked
        ? [...formData[name], value]
        : formData[name].filter((item) => item !== value);

      setFormData({
        ...formData,
        [name]: updatedArray,
      });
    }
    // Handle regular inputs
    else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    setError(null);
  
    // Form validation before submission
    if (
      !formData.fitnessGoal ||
      !formData.fitnessLevel ||
      !formData.availableTime ||
      !formData.daysPerWeek
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }
  
    // Validate numeric values
    if (formData.availableTime <= 0) {
      setError("Available time must be greater than 0");
      setLoading(false);
      return;
    }
  
    if (formData.daysPerWeek < 1 || formData.daysPerWeek > 7) {
      setError("Days per week must be between 1 and 7");
      setLoading(false);
      return;
    }
  
    const token = localStorage.getItem("token");
    try {
      const dataToSend = {
        ...formData,
        timePerWorkout: formData.availableTime * 60 / formData.daysPerWeek // Convert available time per week to minutes per workout
      };
      
      const response = await axios.post(
        `${url}/workout/generate-plan`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.data.actionRequired){
        handleOpenModal()
      }else{
        setGeneratedPlan(response.data.workoutPlan)
        setShowForm(false)
      }
      
    } catch (err) {
      console.error("Error generating plan:", err);
      setError(
        err.response?.data?.message ||
          "Failed to generate workout plan. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleOverride=async()=>{
     const token = localStorage.getItem("token");
    try {
      const dataToSend = {
        ...formData,
        timePerWorkout: formData.availableTime * 60 / formData.daysPerWeek // Convert available time per week to minutes per workout
      };
      
      const response = await axios.post(
        `${url}/workout/generate-plan`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.data.actionRequired){
        handleOpenModal()
      }else{
        setGeneratedPlan(response.data.workoutPlan)
        setShowForm(false)
      }
      
    } catch (err) {
      console.error("Error generating plan:", err);
      setError(
        err.response?.data?.message ||
          "Failed to generate workout plan. Please try again later."
      );
    }
  }
  // Update the handleSavePlan function
  const handleSavePlan = async () => {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please login again.");
      setLoading(false);
      return;
    }
  
    try {
      // Make sure we send all the required data
      const response = await axios.post(
        `${url}/workout/save-plan`,
        {
          planName: formData.planName,
          fitnessGoal: formData.fitnessGoal,  // Include these fields
          fitnessLevel: formData.fitnessLevel, // from the form data
          planData: {
            ...generatedPlan,
            fitnessGoal: formData.fitnessGoal,  // Also include them in planData
            fitnessLevel: formData.fitnessLevel
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update the generated plan with the saved plan (which now has an ID)
      setGeneratedPlan(response.data.plan);
      
      // Show success message
      alert("Workout plan saved successfully!");
      navigate('/dashboard')
      
    } catch (err) {
      console.error("Error saving plan:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save workout plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    generatePlan();
  };

  // Equipment options
  const equipmentOptions = [
    { value: "dumbbells", label: "Dumbbells" },
    { value: "barbell", label: "Barbell" },
    { value: "resistance_bands", label: "Resistance Bands" },
    { value: "bodyweight", label: "Bodyweight Only" },
  ];

  // Focus areas options
  const focusAreasOptions = [
    { value: "chest", label: "Chest" },
    { value: "back", label: "Back" },
    { value: "legs", label: "Legs" },
    { value: "shoulders", label: "Shoulders" },
    { value: "arms", label: "Arms" },
    { value: "core", label: "Core" },
    { value: "full_body", label: "Full Body" },
  ];

  const formFields = [
    {
      label: "Plan Name",
      type: "text",
      value: formData.planName,
      onChange: handleChange,
      required: true,
      name: "planName",
      placeholder: "Enter a name for your workout plan",
    },
    {
      label: "Fitness Goal",
      type: "select",
      value: formData.fitnessGoal,
      onChange: handleChange,
      required: true,
      name: "fitnessGoal",
      options: [
        { value: "", label: "Select a fitness goal" },
        { value: "weight_loss", label: "Weight Loss" },
        { value: "muscle_gain", label: "Muscle Gain" },
        { value: "general_fitness", label: "General Fitness" },
        { value: "strength", label: "Strength" },
        { value: "endurance", label: "Endurance" },
      ],
    },
    {
      label: "Fitness Level",
      type: "select",
      value: formData.fitnessLevel,
      onChange: handleChange,
      required: true,
      name: "fitnessLevel",
      options: [
        { value: "", label: "Select your fitness level" },
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
      ],
    },
    {
      label: "Available Time (hours per week)",
      type: "number",
      value: formData.availableTime,
      onChange: handleChange,
      required: true,
      name: "availableTime",
      min: 1,
      max: 40,
      placeholder: "Enter hours available per week",
    },
    {
      label: "Days Per Week",
      type: "number",
      value: formData.daysPerWeek,
      onChange: handleChange,
      required: true,
      name: "daysPerWeek",
      min: 1,
      max: 7,
      placeholder: "Enter days per week (1-7)",
    },
    {
      label: "Available Equipment",
      type: "checkbox-group",
      value: formData.availableEquipment,
      onChange: handleChange,
      name: "availableEquipment",
      options: equipmentOptions,
    },
    {
      label: "Focus Areas",
      type: "checkbox-group",
      value: formData.focusAreas,
      onChange: handleChange,
      name: "focusAreas",
      options: focusAreasOptions,
    },
    {
      label: "Injuries or Limitations",
      type: "textarea",
      value: formData.injuries.join(", "),
      onChange: (e) => {
        // Split comma-separated values into array
        setFormData({
          ...formData,
          injuries: e.target.value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item),
        });
      },
      name: "injuries",
      placeholder: "List any injuries or limitations (separated by commas)",
    },
    {
      label: "Exercises to Exclude",
      type: "textarea",
      value: formData.excludedExercises.join(", "),
      onChange: (e) => {
        // Split comma-separated values into array
        setFormData({
          ...formData,
          excludedExercises: e.target.value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item),
        });
      },
      name: "excludedExercises",
      placeholder:
        "List any exercises you want to exclude (separated by commas)",
    },
  ];

  // Function to format goal text with proper capitalization
  const formatGoalText = (goal) => {
    return goal.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get the day color based on the day name
  const getDayColor = (day) => {
    const colors = {
      "Monday": "border-blue-500",
      "Tuesday": "border-green-500",
      "Wednesday": "border-purple-500",
      "Thursday": "border-yellow-500",
      "Friday": "border-red-500",
      "Saturday": "border-indigo-500",
      "Sunday": "border-pink-500",
    };
    return colors[day] || "border-gray-500";
  };

  // Get the day header color based on the day name
  const getDayHeaderColor = (day) => {
    const colors = {
      "Monday": "bg-blue-500 text-white",
      "Tuesday": "bg-green-500 text-white",
      "Wednesday": "bg-purple-500 text-white",
      "Thursday": "bg-yellow-500 text-white",
      "Friday": "bg-red-500 text-white",
      "Saturday": "bg-indigo-500 text-white",
      "Sunday": "bg-pink-500 text-white",
    };
    return colors[day] || "bg-gray-500 text-white";
  };

  // Handle discard plan - reset to form view
  const handleDiscardPlan = () => {
    setGeneratedPlan(null);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      {showForm ? (
        <>
          <FormComponent
            formTitle="Workout Plan Generator"
            onSubmit={handleSubmit}
            submitButtonText="Generate Plan"
            fields={formFields}
          />

          {loading && (
            <div className="flex justify-center items-center my-8 p-6 bg-white rounded-lg shadow-md">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-lg font-medium text-gray-700">
                Generating your personalized workout plan...
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          {loading && (
            <div className="flex justify-center items-center my-8 p-6 bg-white rounded-lg shadow-md">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-lg font-medium text-gray-700">
                Processing your workout plan...
              </span>
            </div>
          )}
          
          {generatedPlan && !loading && (
            <DisplayWorkoutPlan 
              generatedPlan={generatedPlan}
              onDiscard={handleDiscardPlan}
              onSave={handleSavePlan}
              formData={formData}
              formatGoalText={formatGoalText}
              getDayColor={getDayColor}
              getDayHeaderColor={getDayHeaderColor}
            />
          )}
        </>
      )}
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <h2>You have existing plan</h2>
          <div><button onClick={handleOverride}>Override</button>
          <button onClick={handleCloseModal}>Keep existing plan</button></div>
        </Modal>
      )}
    </div>
  );
};

export default WorkoutPlanComponent;