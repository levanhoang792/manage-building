import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Login from "@/pages/login/Login.tsx";
import Home from "@/pages/home/Home.tsx";

function App() {
    return (
        <Router>
            <Routes>
                {/* Define your routes */}
                <Route path="/" element={<Home/>}/>
                <Route path="/home" element={<Navigate to="/"/>}/>

                <Route path="/login" element={<Login/>}/>

                {/* Catch-all route for 404 */}
                {/*<Route path="*" element={<NotFoundPage/>}/>*/}
            </Routes>
        </Router>
    )
}

export default App
