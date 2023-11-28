import { useEffect, useState } from "react"
import { Response, ResultsResponse, StartupWithResults } from "../types";
import { Loader } from "../components/Loader";
import $ from "jquery";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function VoteResults() {
    const [fetching, setFetching] = useState<boolean>(true);
    const [startups, setStartups] = useState<StartupWithResults[]>();
    const [error, setError] = useState<string>("");
    const [total, setTotal] = useState<{
        concept: number,
        presentation: number
    }>();

    // Get results from database.
    useEffect(() => {
        $.ajax({
            url: "http://localhost:8000/startups/getresults.php",
            method: "GET",
            success(data) {
                const dataObj: ResultsResponse = JSON.parse(data);
                setFetching(false);
                setStartups(dataObj.startups);
                setTotal(dataObj.total);
            },
            error(data) {
                const dataObj: Response = JSON.parse(data.responseText);
                setError(dataObj.message)
            }
        }).catch(() => {
            setError("Something went wrong!")
        })
    }, []) 

    return (
        <div className="flex items-center justify-center w-screen h-screen ">
            {fetching && <Loader />}
            {error && <p>{error}</p>}
            <div className="grid grid-cols-3 gap-2 ">
            {startups && <>
                {startups.map((startup) => {
                    return (
                        <StartupGraph key={startups.indexOf(startup)}  startup={startup} total={total!} />
                    )
                })}
            </>}
            </div>
        </div>
    )
}

function StartupGraph({ startup, total }: { startup: StartupWithResults, total: {
    concept: number,
    presentation: number
}}) {
    const presentation_percentage = startup.presentation_points / total.presentation * 100;
    const concept_percentage = startup.concept_points / total.concept * 100;

    const presentation_style = {
        width: `${presentation_percentage.toFixed(0)}%`
    }
    const concept_style = {
        width: `${presentation_percentage.toFixed(0)}%`
    }
    return (
        <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{ duration: 0.5}}
        className="grid gap-2 p-5 bg-white border-2 shadow-md grid-rows-7 rounded-xl border-gray-300/30 w-[30vw]">
            <p className="text-xl font-bold ">{startup.startup_name}</p>
            <p>{presentation_percentage.toFixed(2)}% ({startup.presentation_points} Points)</p><div style={presentation_style} className="p-2 bg-blue-500 border-2 shadow-md rounded-xl border-gray-300/30"></div>
            <p>{concept_percentage.toFixed(2)}% ({startup.concept_points} Points)</p><div style={concept_style} className="p-2 bg-blue-500 border-2 shadow-md rounded-xl border-gray-300/30"></div>
            <Link className="px-3 py-2 font-bold text-center text-white bg-blue-500 shadow-md rounded-xl" to={`/startup/${startup.startup_id}`}>Vote for this startup</Link>
        </motion.div>
    )
}