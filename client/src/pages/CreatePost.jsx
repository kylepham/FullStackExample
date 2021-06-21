import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
    // const { authState } = useContext(AuthContext);
    const history = useHistory();
    const initialValues = {
        title: "",
        postText: "",
    };

    useEffect(() => {
        if (!localStorage.getItem('accessToken'))
            history.push('/login')
    }, [])

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("You must input a title"),
        postText: Yup.string().required("You must input a post content"),
    });

    const onSubmit = (data) => {

        axios.post("http://localhost:5000/posts", data, {
            headers: {
                accessToken: localStorage.getItem('accessToken')
            }
        }).then(() => {
            history.push("/"); // navigate back to homepage
        });
    };

    return (
        <div className="createPostPage">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <label>Title: </label>
                    <ErrorMessage name="title" component="span" />
                    <Field
                        id="inputCreatePost"
                        name="title"
                        placeholder="(Ex. John)"
                    />

                    <label>Post: </label>
                    <ErrorMessage name="postText" component="span" />
                    <Field
                        id="inputCreatePost"
                        name="postText"
                        placeholder="(Ex. Post)"
                    />

                    <button type="submit">Create Post</button>
                </Form>
            </Formik>
        </div>
    );
}

export default CreatePost;
