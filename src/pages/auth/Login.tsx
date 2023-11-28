import $ from "jquery";
import { useContext, useState } from "react";
import { Logo } from "../../components/Logo";
import { RegisterResponse, Response, User } from "../../types";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../../UserContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function Login() {
    const [mail, setMail] = useState<string>("");
    const { setUser } = useContext(UserContext)
    const [password, setPassword] = useState<string>("");
    const nav = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        const form = $(e.target);

        $.ajax({
            url: form.attr("action"),
            method: form.attr("method"),
            data: form.serialize(),
            success(data) {
                const dataObj: RegisterResponse = JSON.parse(data);
                toast(dataObj.message, {
                    type: "success",
                })

                const user: User = {
                    user_id: dataObj.user_id,
                    email: mail,
                    updated: false,
                    token: dataObj.token,
                    password_hash: ""
                }

                localStorage.setItem("USER", JSON.stringify(user));
                if (setUser == undefined) {
                    return;
                }
                setUser(user);
                nav("/")
            },
            error(data) {
                const dataObj: Response = JSON.parse(data.responseText);
                toast(dataObj.message, {
                    type: "error",
                })
            }
        })
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen gap-10 ">
            <Logo className=" max-w-[30%]" />
            <motion.form
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{ duration: 0.5}}
            onSubmit={handleSubmit} action="http://localhost:8000/registration/login.php" method="POST" className="flex flex-col gap-2 px-20 py-10 bg-white border-2 border-solid shadow-md border-gray-600/30 rounded-xl">
                <p className="text-2xl font-oswald">Please log in to your account continue</p>
                <label htmlFor="email">Your email:</label>
                <input type="email" className="px-3 py-2 transition-all border-2 border-gray-100 border-solid shadow-sm outline-none rounded-xl focus:shadow-md" name="email" placeholder="example@provider.com" value={mail} onChange={(event) => setMail(event.target.value)} />
                <label htmlFor="password">Your password:</label>
                <input type="password" className="px-3 py-2 transition-all border-2 border-gray-100 border-solid shadow-sm outline-none rounded-xl focus:shadow-md" name="password" placeholder="UIy8yB8g8776h" value={password} onChange={(event) => setPassword(event.target.value)} />
                <button className="px-3 py-2 text-white transition-all bg-blue-500 shadow-md rounded-xl font-oswald hover:scale-105 active:scale-95 active:shadow-inner">Continue</button>
            </motion.form>
            <Link to={'/register'} className="text-blue-500 hover:underline">I don't yet have an account</Link>

        </div>
    )
}