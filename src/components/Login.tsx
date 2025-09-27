import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "./Alert";
export default function Login() {
  const { showAlert } = useAlert();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    api
      .post("/users/login", form)
      .then((res) => {
        console.log(res);
        localStorage.setItem("token", res.data.data?.accessToken);
        localStorage.setItem("username", res.data.data?.user?.username);
        showAlert("Login successful!", "success");
        navigate("/dashboard");
      })
      .catch((err) => {
        showAlert(err.response?.data?.message || "Login failed", "error");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <Typography variant="h5" className="mb-4 text-center font-bold">
            Login
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="!mt-2"
            >
              Login
            </Button>

            <div className="text-center mt-4">
              <Link
                to="/signup"
                className="text-blue-600 hover:underline text-sm"
              >
                Don’t have an account? Sign Up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
