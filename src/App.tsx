import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import '@/App.css'
import Page from "@/Page.tsx";

function App() {
    return (
        <Router>
            <Routes>
                {/* Define your routes */}
                <Route path="/" element={<Page/>}/>
                {/*<Route path="/about" element={<AboutPage/>}/>*/}

                {/* Redirect Example */}
                <Route path="/home" element={<Navigate to="/"/>}/>

                {/* Catch-all route for 404 */}
                {/*<Route path="*" element={<NotFoundPage/>}/>*/}
            </Routes>
        </Router>
    )
}

export default App
