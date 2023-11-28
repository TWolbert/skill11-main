import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { Response, User } from "./types"
import $ from "jquery";
import { UserContext } from "./UserContext";
import { NavBar } from "./components/Navbar";

function App() {
  const [user, setUser] = useState<User>(JSON.parse(localStorage.getItem("USER")!) as User ?? {} as User)
  const nav = useNavigate();
  useEffect(() => {
    if (document.location.pathname == "/login") {
      return; 
    }
    if (user.token === undefined) {
      nav("/register")
      return;
    }
    const user_id = user.user_id;
    const token = user.token;
    $.ajax({
      url: "http://localhost:8000/registration/verifytoken.php",
      method: "POST",
      data: { token, user_id },
      success(data) {
        const dataObj: Response = JSON.parse(data);

        if (dataObj.status === "success") {
          console.log("authed")
          return;
        }
        else {
          nav("/register")
        }
      },
      error() {
        nav("/register")
      }
    })
  }, [user, nav])


  return (
    <div className='min-h-screen bg-gray-100 min-w-screen'>
      <ToastContainer theme="light" />
      <UserContext.Provider value={{user, setUser}}>
        <NavBar />
        <Outlet />
      </UserContext.Provider>
    </div>
  )
}

export default App
