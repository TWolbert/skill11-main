import { useContext, useEffect, useState } from "react"
import { Response, Startup, StartupsResponse, userContext } from "./types"
import { UserContext } from "./UserContext"
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import { Loader } from "./components/Loader";
import { motion } from "framer-motion"

export function Home() {
    const { user }: userContext = useContext(UserContext);
    const [startups, setStartups] = useState<Startup[]>();
    const [fetching, setFetching] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    const nav =  useNavigate();

    useEffect(() => {
        $.ajax({
            method: "GET",
            url: "http://localhost:8000/startups/getstartups.php",
            success(data) {
                const dataObj: StartupsResponse = JSON.parse(data);

                setStartups(dataObj.startups);
                setFetching(false);
            },
            error(data) {
                const dataObj: Response = JSON.parse(data.responseText);

                setError(dataObj.message);
                setFetching(false);
            }
        }).catch(() => {
            setError("Something went wrong");
            setFetching(false);
        })
    }, [])

    // Send user back if they are not registerd
    if (user === undefined) {
        nav('/register')
        return;
    }

    function Logout() {
        localStorage.removeItem("USER");
        nav('/login');
    }


    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen gap-3 ">
            <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{ duration: 0.5}}
            className="px-20 py-5 bg-white border-2 shadow-md border-gray-300/30 rounded-xl w-[70vw]">
                <div className="flex items-center justify-between w-full mb-2">
                    <p className="text-2xl font-oswald">The six startups:</p>
                    <p>You are <span className="font-bold">{user.email}</span><button onClick={Logout} className="px-1 py-2 ml-2 font-bold text-white bg-blue-500 shadow-md rounded-xl">Log out</button></p>
                </div>
                <div className="grid grid-cols-3 grid-rows-2 gap-2">
                    {fetching && <Loader />}
                    {error && <p>{error}</p>}
                {startups?.map((startup) => {
                    return (
                        <StartupView key={startups.indexOf(startup)} startup={startup} />
                    )
                })}
                </div>
            </motion.div>
            <Link className="px-3 py-2 font-bold text-white bg-blue-500 shadow-md rounded-xl" to={'/startup/results'}>Show voting results</Link>
        </div>
    )
}

function StartupView({ startup }: { startup: Startup}) {

    return (
            <Link to={`/startup/${startup.startup_id}`} className="p-2 border-2 border-gray-100 shadow-md rounded-xl">
                    <img className="object-cover rounded-md shadow-sm aspect-video" src={`/${startup.startup_logo_filename}`} />
                    <h1 className="text-xl font-bold text-center font-oswald">{startup.startup_name}</h1>
                    <div className="flex flex-col justify-between ">
                    <p className="h-auto px-2">{startup.startup_tagline}</p>
                    <p className="px-2 mt-auto text-sm text-gray-500 h-fit">{startup.startup_location}</p>
                    </div>
                   
            </Link>
    )
}