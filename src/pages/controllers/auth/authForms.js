import React from "react";
import InputField from "./InputFields";


const AuthForm = ({ fields, onChange, onSubmit }) => {   
    return (
        <form onSubmit={onSubmit}>
            {fields.map((field) => (
                <InputField
                key={field.label}
                label={field.label}
                type={field.type}
                value={field.value}
                onChange={(value) => onChange(field.name, value)}
                />
            ))}
            
            <input 
                type="submit" 
                id="submit" 
                value="Submit" 
            />
        </form>
    );
};


export default AuthForm;