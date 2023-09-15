import InputField from "./InputField";

const LockToken = ({ duration, setDuration, setethAmountL, ethAmountL, onClick }) => {
    return (
        <div className="srceen">
            <div className="input-wrapper">
                <h2 className="heading">Lock Token</h2>

                <div className="input-field-container">
                    <div className="w-full">
                        <label className="amount-label">Amount</label>
                        <div className="amount-input-wrapper">
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

                <div className="input-field-container">
                    <label htmlFor="duration" className="amount-label">Duration</label>
                    <InputField
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Enter Your duration"
                        className="amount-input"
                    />
                </div>
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