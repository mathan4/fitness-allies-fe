import React from "react";

const FormComponent = ({ onSubmit, formTitle, submitButtonText, fields }) => {
  const renderField = (field) => {
    switch (field.type) {
      case "select":
        return (
          <select
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {field.options.map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            required={field.required}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
          />
        );

      case "checkbox-group":
        return (
          <div className="space-y-2">
            {field.options.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${field.name}-${option.value}`}
                  name={field.name}
                  value={option.value}
                  checked={field.value.includes(option.value)}
                  onChange={field.onChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`${field.name}-${option.value}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case "radio-group":
        return (
          <div className="space-y-2">
            {field.options.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.name}-${option.value}`}
                  name={field.name}
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={field.onChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor={`${field.name}-${option.value}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            required={field.required}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">{formTitle}</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        {fields.map((field, index) => (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
            {field.helperText && (
              <p className="mt-1 text-xs text-gray-500">{field.helperText}</p>
            )}
          </div>
        ))}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormComponent;