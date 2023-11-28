import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import $ from "jquery";
import { Startup, StartupResponse } from "../../types";
import { VoteForm } from "../../components/VoteForm";
import { UserContext } from "../../UserContext";
import { Loader } from "../../components/Loader";
import { CardText, Map, Megaphone } from "react-bootstrap-icons";
import { motion } from "framer-motion";

export function StartupFull() {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const [fetching, setFetching] = useState<boolean>(true)
    const [startup, setStartup] = useState<Startup>();

    useEffect(() => {
        $.ajax({
            method: "POST",
            url: "http://localhost:8000/startups/getstartupbyid.php",
            data: { id },
            success(data) {
                const dataObj: StartupResponse = JSON.parse(data);
                setFetching(false);
                setStartup(dataObj.startup);
            },
            error(data) {
                console.log(data.responseText);
                setFetching(false);
            }
        })
    }, [id])

    return (
        <>
            {fetching && <Loader />}
            <div className="flex flex-col items-center justify-center w-screen h-screen">
                {startup && user && (
                    <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{ duration: 0.5}}
                    className="max-w-[90%] px-20 py-10 bg-white border-2 shadow-md rounded-xl border-gray-300/30">
                        <div className="grid items-center grid-cols-2 gap-5 ">
                            <img className="object-cover border-b-2 border-solid shadow-sm rounded-xl aspect-square border-gray-300/30" src={`/${startup.startup_logo_filename}`} />
                            <div className="flex flex-col justify-between h-full">
                                <div className="flex flex-col gap-2">
                                    <p className="text-2xl font-bold">{startup?.startup_name}</p>
                                    <div className="grid grid-cols-2 gap-5 ">
                                        <p className="col-span-1 ">{startup.startup_description}</p>
                                        <div>
                                            <div className="flex items-center gap-2"><Map />{startup.startup_location}</div>
                                            <div className="flex items-center gap-2"><CardText />{startup.startup_category}</div>
                                            <div className="flex items-center gap-2"><Megaphone />{startup.startup_tagline}</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-xl font-oswald">Vote for {startup.startup_name}</h1>
                                    <VoteForm startup_id={startup?.startup_id} user_id={user?.user_id} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </>

    )
}