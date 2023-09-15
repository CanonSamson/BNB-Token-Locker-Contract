
const Navbar = ({ Address }) => {
    // const maskAddress = (address) => {
    //     const prefix = address.slice(0, 6);
    //     const middle = 'xxx';
    //     const suffix = address.slice(-4);
    //     return `${prefix}${middle}${suffix}`;
    // }

    return (
        <nav className="  ">
            <h1 className="">Toke<span className="">n L</span>ocker</h1>
            <div className=" flex items-center gap-3">
                <button className="  ">Log Out</button>
                <button className=" "> {Address && Address ? Address : "Connect"}</button>
            </div>
        </nav>
    );
}

export default Navbar;