
const InputField = ({ id, label, type, error, ...input }) => {
    return (
        <div className="input-container">
            <label className="input-label" htmlFor={id}>
                {label}
            </label>
            <div className="">
                <input
                    id={id}
                    type={type}
                    className="input-field"
                    {...input}
                   
                />
            </div>
            <small className="error-message">{error}</small>
        </div>
    );
};

export default InputField;
