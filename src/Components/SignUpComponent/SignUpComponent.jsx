import React, { useState } from "react";
import AuthForm from "../FormComponent/FormComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUpComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const url = import.meta.env.VITE_BASE_URL
  const Navigate= useNavigate()

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleNameChange=(e)=> setName(e.target.value)
  const handleBioChange=(e)=> setBio(e.target.value)
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSignupSubmit = async(e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/signup`, {
        email,
        password,
        name,
        bio,
      });
      Navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
    }

  };

  const signupFields = [
    {
      label: "Name",
      type: "text",
      value: name,
      onChange: handleNameChange,
      required: true,
    }, 
     {
      label: "Bio",
      type: "text",
      value: bio,
      onChange: handleBioChange,
      required: true,
    },
    {
      label: "Email",
      type: "email",
      value: email,
      onChange: handleEmailChange,
      required: true,
    },
    {
      label: "Password",
      type: "password",
      value: password,
      onChange: handlePasswordChange,
      required: true,
    },
    {
      label: "Confirm Password",
      type: "password",
      value: confirmPassword,
      onChange: handleConfirmPasswordChange,
      required: true,
    },
  ];

  return (
    <>
     <AuthForm
      onSubmit={handleSignupSubmit}
      formTitle="Signup"
      submitButtonText="Signup"
      fields={signupFields}
    />
     <div className="mt-4 text-center">
      <p>
        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
      </p>
    </div>
    </>
  );
};

export default SignUpComponent;
