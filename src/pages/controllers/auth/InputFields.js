import React from "react";


const InputField = ({ label, type, value, onChange }) => {
    return (
      <>
        <label htmlFor={label}>{label}</label>
        <input
          type={type}
          id={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </>
    );
};


export default InputField;