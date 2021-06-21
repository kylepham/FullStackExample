import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import ThumbUpAlt from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";
import { Link } from "react-router-dom";

function Home() {
    const { authState } = useContext(AuthContext);
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) history.push("/login");
        else {
            axios
                .get("http://localhost:5000/posts", {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                })
                .then((response) => {
                    setListOfPosts(response.data.posts);
                    setLikedPosts(
                        response.data.likedPosts.map(
                            (likedPost) => likedPost.PostId
                        )
                    );
                });
        }
    }, []);

    const likeAPost = (postId) => {
        axios
            .post(
                "http://localhost:5000/like",
                { PostId: postId },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            )
            .then((response) => {
                setListOfPosts(
                    listOfPosts.map((post) => {
                        if (post.id === postId) {
                            if (response.data.liked)
                                return { ...post, Likes: [...post.Likes, {}] };
                            else {
                                const cloneLikes = post.Likes;
                                cloneLikes.pop();
                                return { ...post, Likes: cloneLikes };
                            }
                        } else return post;
                    })
                );

                if (response.data.liked) setLikedPosts([...likedPosts, postId]);
                else
                    setLikedPosts(
                        likedPosts.filter((likedPost) => likedPost !== postId)
                    );
            });
    };

    return (
        <div className="App">
            {listOfPosts.map((post, index) => {
                return (
                    <div className="post" key={index}>
                        <div className="title">{post.title}</div>
                        <div
                            className="body"
                            onClick={() => history.push(`/post/${post.id}`)}
                        >
                            {post.postText}
                        </div>
                        <div className="footer">
                            <div className="username">
                                <Link to={`/profile/${post.UserId}`}>
                                    {post.username}
                                </Link>
                            </div>
                            <div className="buttons">
                                <ThumbUpAlt
                                    onClick={() => likeAPost(post.id)}
                                    className={
                                        likedPosts.includes(post.id)
                                            ? "unlikeBttn"
                                            : "likeBttn"
                                    }
                                />
                                <label>{post.Likes.length}</label>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Home;
