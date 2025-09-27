import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { useAlert } from "./Alert";
export default function Signup() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const navigate = useNavigate();
  const { showAlert } = useAlert();
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
      .post("/users/register", form)
      .then((_res) => {
        showAlert("Signup successful! Please login.", "success");
        navigate("/");
      })
      .catch((err) => {
        showAlert(err.response?.data?.message || "Signup failed", "error");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <Typography variant="h5" className="mb-4 text-center font-bold">
            Sign Up
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
              Sign Up
            </Button>

            <div className="text-center mt-4">
              <Link to="/" className="text-blue-600 hover:underline text-sm">
                ← Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
