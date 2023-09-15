import { AiFillWallet, AiOutlineFieldTime } from "react-icons/ai";
import { GiReceiveMoney } from "react-icons/gi";

// Header component that displays user information, locked tokens, locking time, and token rewards
const Header = ({ lockedToken, userTokensRewards, lockTimestamp, user }) => {
    return (
        <div className=" ">
            {/* Header section */}
            <div className="header ">
                {/* Display user's name if available */}
                {user && <h2 className="">Hello, {user[1]}  {user[2]} </h2>}
                <p className=" text-[14px]">
                    Secure vault for you to lock Your tokens for a specified period,
                    earning rewards over time.
                </p>
            </div>

            {/* Cards section */}
            <div className="cards">
                {/* Card for displaying locked tokens */}
                <div className=" card">
                    <AiFillWallet size={50} />
                    <div className="">
                        <span>Locked Token</span>
                        <div className="">
                            {/* Display locked token amount and unit (BNB) */}
                            <span>{lockedToken && lockedToken}</span>
                            <span>BNB</span>
                        </div>
                    </div>
                </div>

                {/* Card for displaying locking time */}
                <div className=" card">
                    <AiOutlineFieldTime size={50} />
                    <div className="">
                        <span>Locking Time</span>
                        <div className="">
                            {/* Display locking time if tokens are locked */}
                            <span>  {lockedToken != 0 && lockTimestamp && lockTimestamp}</span>
                        </div>
                    </div>
                </div>

                {/* Card for displaying token rewards */}
                <div className=" card">
                    <GiReceiveMoney size={50} />
                    <div className="">
                        <span>Token Rewards</span>
                        <div className="">
                            {/* Display user's token rewards and unit (BNB) */}
                            <span> {userTokensRewards && userTokensRewards}</span>
                            <span>BNB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
