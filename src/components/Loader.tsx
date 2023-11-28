import { HourglassBottom } from "react-bootstrap-icons";

export function Loader() {
    return (
        <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen">
            <HourglassBottom className=" text-[20vh] animate-spin" />
        </div>
    )
}