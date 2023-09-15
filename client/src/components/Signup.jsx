
import { useState } from "react";
import InputField from "./InputField"
import { AiOutlineReload } from "react-icons/ai";
const Signup = ({ setName, name, onClick, setLastName, lastName }) => {
    const [submit, setSubmit] = useState(false);
    const [errorM, setErrorM] = useState("");


    return (
        <div className="srceen">
            <div className="input-wrapper">
                <h1 className="title">Create Account</h1>
                <p className="description">
                    Secure vault for you to lock Your tokens for a specified period,
                    earning rewards over time.
                </p>
                <div className="error-message">{errorM && errorM}</div>
                <div className="input-field">
                    <label for="name">Name</label>
                    <InputField
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Your name"
                    />
                </div>
                <div className="input-field">
                    <label for="lastName">LastName</label>
                    <InputField
                        id="lastName"
                        required="true"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter lastName"
                    />
                </div>
                <p className="error-message">{errorM && errorM}</p>
                <button
                    onClick={onClick}
                    className="button"
                >
                    {submit ? (
                        <p className="spinner"><AiOutlineReload size={20} /></p>
                    ) : (
                        `Create Account`
                    )}
                </button>
            </div>
        </div>

    )
};

export default Signup;
