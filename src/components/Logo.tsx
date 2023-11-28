import logo from "../assets/SDGCatalysts-logo.svg";
export function Logo({ className}: { className?: string}) {
    return (
        <img src={logo} className={className} alt="SDG Catalysts logo" />
    )
}