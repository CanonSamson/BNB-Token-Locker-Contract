import InputField from "./InputField";

// LockToken component for rendering a form to lock tokens
const LockToken = ({ duration, setDuration, setethAmountL, ethAmountL, onClick }) => {
    return (
        <div className="srceen">
            {/* Input wrapper */}
            <div className="input-wrapper">
                <h2 className="heading">Lock Token</h2>

                {/* Container for the amount input field */}
                <div className="input-field-container">
                    <div className="w-full">
                        {/* Label for the amount input */}
                        <label className="amount-label">Amount</label>
                        <div className="amount-input-wrapper">
                            {/* Amount input field */}
                            <input
                                id="amount"
                                type="text"
                                placeholder="Ex: 0.002"
                                className="amount-input"
                                value={ethAmountL}
                                onChange={(e) => setethAmountL(e.target.value)}
                            />
                            <span className="unit">BNB</span>
                        </div>
                    </div>
                </div>

                {/* Container for the duration input field */}
                <div className="input-field-container">
                    <label htmlFor="duration" className="amount-label">Duration</label>
                    {/* Use the reusable InputField component for the duration input */}
                    <InputField
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Enter Your duration"
                        className="amount-input"
                    />
                </div>

                {/* Lock button */}
                <button
                    onClick={onClick}
                    className="lock-button"
                >
                    Lock
                </button>
            </div>
        </div>
    );
}

export default LockToken;
