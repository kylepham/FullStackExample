import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function Register() {
    const initialValues = {
        username: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(3)
            .max(15)
            .required("You must input a username"),
        password: Yup.string()
            .min(4)
            .max(20)
            .required("You must input a password"),
    });

    const onSubmit = (data) => {
        axios.post("http://localhost:5000/auth", data).then((response) => {
            console.log(data);
        });
    };

    return (
        <div className="loginContainer">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <label>Username: </label>
                    <ErrorMessage name="username" component="span" />
                    <Field
                        id="inputCreatePost"
                        name="username"
                        placeholder="Your Username"
                    />

                    <label>Password: </label>
                    <ErrorMessage name="password" component="span" />
                    <Field
                        id="inputCreatePost"
                        name="password"
                        placeholder="Your Password"
                        type="password"
                    />
                    <button type="submit">Register</button>
                </Form>
            </Formik>
        </div>
    );
}

export default Register;
