import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import PageNotFound from "./pages/PageNotFound";

import { AuthContext } from "./helpers/AuthContext";
import axios from "axios";

function App() {
    const initialAuthState ={username: '', id: 0, status: false} 
    const [authState, setAuthState] = useState(initialAuthState);
    
    useEffect(() => {
        axios.get("http://localhost:5000/auth/auth", {
            headers: {
                accessToken: localStorage.getItem('accessToken')
            }
        }).then((response) => {
            if (response.data.error) setAuthState(initialAuthState);
            else setAuthState({username: response.data.username, id: response.data.id, status: true});
        });
    }, []);

   

    const logout = () => {
        localStorage.removeItem('accessToken')
        setAuthState(initialAuthState)
    }

    return (
        <div className="App">
            <AuthContext.Provider value={{ authState, setAuthState }}>
                <Router>
                    <div className="navbar">
                        <div className='links'>

                            
                            {!authState.status ? (
                                <>
                                    <Link to="/login">Login</Link>
                                    <Link to="/Profile">Register</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/">Homepage</Link>
                                    <Link to="/createPost">Create a Post</Link>
                                </>
                            )}
                        </div>
                        <div className='loggedInContainer'>
                            <h1>{authState.username}</h1>
                            {authState.status && <button onClick={logout}>Logout</button>}
                        </div>
                    </div>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route
                            path="/createPost"
                            exact
                            component={CreatePost}
                        />
                        <Route path="/post/:id" exact component={Post} />
                        <Route path="/login" exact component={Login} />
                        <Route path="/register" exact component={Register} />
                        <Route path="/profile/:id" exact component={Profile} />
                        <Route path="/changepassword" exact component={ChangePassword} />
                        <Route path="*" exact component={PageNotFound} />
                    </Switch>
                </Router>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
