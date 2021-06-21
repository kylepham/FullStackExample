import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
    const { id } = useParams();
    const history = useHistory()
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`http://localhost:5000/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
        });

        axios.get(`http://localhost:5000/comments/${id}`).then((response) => {
            setComments(response.data);
        });
    }, []);

    const addComment = () => {
        axios
            .post(
                `http://localhost:5000/comments`,
                {
                    commentBody: newComment,
                    PostId: id,
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            )
            .then((response) => {
                if (response.data.error) console.log(response.data.error);
                else {
                    setComments([
                        ...comments,
                        {
                            commentBody: newComment,
                            username: response.data.username,
                        },
                    ]);
                    // console.log(response.data)
                    setNewComment("");
                }
            });
    };

    const deleteComment = (id) => {
        axios.delete(`http://localhost:5000/comments/${id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        }).then(() => {
            setComments(comments.filter(comment => comment.id !== id))
            console.log('Comment deleted')
        });
    };

    const deletePost = (id) => {
        axios.delete(`http://localhost:5000/posts/${id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        }).then(() => {
            history.push('/')
        });
    }

    const editPost = (option) => {
        if (authState.username !== postObject.username)
            return;

        // body or title
        if (option === "title") {
            let newTitle = prompt("Enter a new title: ")
            axios.put(`http://localhost:5000/posts/title`, {
                title: newTitle,
                id,  
            }, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                }, 
            })
            setPostObject({...postObject, title: newTitle})
        } else {
            let newText = prompt("Enter a new text: ")
            axios.put(`http://localhost:5000/posts/body`, {
                postText: newText,
                id,  
            }, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                }, 
            })
            setPostObject({...postObject, postText: newText})
        }
    };

    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                    <div className="title" onClick={() => editPost("title")}>{postObject.title}</div>
                    <div className="body" onClick={() => editPost("body")}>{postObject.postText}</div>
                    <div className="footer">
                        {postObject.username}
                        {authState.username === postObject.username && <button onClick={() => deletePost(id)}>Delete Post</button>}
                    </div>
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input
                        type="text"
                        placeholder="Comment..."
                        autoComplete="off"
                        autoCorrect="off"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={addComment}>Add comment</button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, index) => {
                        return (
                            <div className="comment" key={index}>
                                {comment.commentBody} <br />
                                <a href="#">@{comment.username}</a>
                                {authState.username === comment.username && (
                                    <button
                                        onClick={() =>
                                            deleteComment(comment.id)
                                        }
                                    >
                                        x
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Post;
