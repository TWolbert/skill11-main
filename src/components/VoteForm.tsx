import $ from "jquery";
import { Response } from "../types";
import { toast } from "react-toastify";

export function VoteForm({ startup_id, user_id }: { startup_id: number, user_id: number}) {
    
    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = $(e.target);

        $.ajax({
            method: "POST",
            url: "http://localhost:8000/startups/submitvote.php",
            data: form.serialize(),
            success(data) {
                const dataObj: Response = JSON.parse(data);

                toast(dataObj.message, {
                    type: "success"
                })
            },
            error(data) {
                const dataObj: Response = JSON.parse(data.responseText);

                toast(dataObj.message, {
                    type: "error"
                })
            }
        })
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-2 p-5 border-2 shadow-md border-gray-300/30 rounded-xl">
            <label htmlFor="concept">Startup Concept</label>
            <input type="text" name="user_id" value={user_id} readOnly hidden />
            <input type="text" name="startup_id" value={startup_id} readOnly hidden />
            <div className="flex gap-2">
                <input type="radio" name="concept" value={1} />
                <label htmlFor="concept">1</label>
                <input type="radio" name="concept" value={2} />
                <label htmlFor="concept">2</label>
                <input type="radio" name="concept" value={3} />
                <label htmlFor="concept">3</label>
                <input type="radio" name="concept" value={4} />
                <label htmlFor="concept">4</label>
                <input type="radio" name="concept" value={5} />
                <label htmlFor="concept">5</label>
            </div>
            <label htmlFor="presentation">Startup Presentation</label>
            <div className="flex gap-2">
                <input type="radio" name="presentation" value={1} />
                <label htmlFor="presentation">1</label>
                <input type="radio" name="presentation" value={2} />
                <label htmlFor="presentation">2</label>
                <input type="radio" name="presentation" value={3} />
                <label htmlFor="presentation">3</label>
                <input type="radio" name="presentation" value={4} />
                <label htmlFor="presentation">4</label>
                <input type="radio" name="presentation" value={5} />
                <label htmlFor="presentation">5</label>
            </div>
            <button className="px-3 py-2 text-white bg-blue-500 shadow-md rounded-xl">Submit</button>
        </form>
    )
}