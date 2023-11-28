import { Logo } from "./Logo";
import { useNavigate } from "react-router-dom";

export function NavBar() {
    const nav = useNavigate();

    return (
        <nav className="fixed z-50 flex items-center justify-center w-screen h-20 p-2 border-b-2 border-gray bg-gray-500/30 backdrop-blur-md">
            <button onClick={(() => nav('/'))}><Logo className="h-14"/></button> 
        </nav>
    )

}