// InputField component for rendering form input fields
const InputField = ({ id, label, type, error, ...input }) => {
    return (
        <div className="input-container">
            {/* Label for the input field */}
            <label className="input-label" htmlFor={id}>
                {label}
            </label>
            <div className="">
                {/* Input field element */}
                <input
                    id={id}
                    type={type}
                    className="input-field"
                    {...input} // Spread any additional input properties (e.g., onChange, value, placeholder)
                />
            </div>
            {/* Display error message if there is an error */}
            <small className="error-message">{error}</small>
        </div>
    );
};

export default InputField;
