import { AiFillWallet, AiOutlineFieldTime } from "react-icons/ai"
import { GiReceiveMoney } from "react-icons/gi"

const Header = ({ lockedToken, userTokensRewards, lockTimestamp, user }) => {
    return (<div className=" ">
        <div className="header ">
            {user && <h2 className="">Hello, {user[1]}  {user[2]} </h2>}
            <p className=" text-[14px]">   Secure vault for you to lock Your tokens for a specified period,
                earning rewards over time.</p>
        </div>

        <div className="cards">
            <div className=" card">
                <AiFillWallet size={50} />
                <div className="">
                    <span>Locked Token</span>
                    <div className="">
                        <span>{lockedToken && lockedToken}</span>
                        <span>BNB</span>
                    </div>
                </div>
            </div>
            <div className=" card">
                <AiOutlineFieldTime size={50} />
                <div className="">
                    <span>Locking Time</span>
                    <div className="">

                        <span>  {lockedToken != 0 && lockTimestamp && lockTimestamp}</span>
                    </div>
                </div>
            </div>
            <div className=" card">
                <GiReceiveMoney size={50} />
                <div className="">
                    <span>Token Rewards</span>
                    <div className="">
                        <span> {userTokensRewards && userTokensRewards}</span>
                        <span>BNB</span>
                    </div>
                </div>
            </div>

        </div>
    </div>);
}

export default Header;