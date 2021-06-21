import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
    const { id } = useParams();
    const [username, setUsername] = useState("");
    const [posts, setPosts] = useState([]);
    const { authState } = useContext(AuthContext);
    const history = useHistory()

    useEffect(() => {
        axios
            .get(`http://localhost:5000/auth/basicInfo/${id}`)
            .then((response) => {
                setUsername(response.data.username);
            });
        axios
            .get(`http://localhost:5000/posts/byUserId/${id}`)
            .then((response) => {
                setPosts(response.data);
            });
    }, []);

   

    return (
        <div className="profilePageContainer">
            <div className="basicInfo">
                <h1>Username: {username} </h1>
                {authState.username === username && <button onClick={() => history.push('/changepassword')}>Change password</button> }
            </div>
            <div className="listOfPosts">
                {posts.map((post, index) => {
                    return (
                        <div className="post" key={index}>
                            <div className="title">{post.title}</div>
                            <div className="body">{post.postText}</div>
                            <div className="footer">
                                <div className="username">{post.username}</div>
                                <div className="buttons">
                                    <label>{post.Likes.length}</label>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Profile;
