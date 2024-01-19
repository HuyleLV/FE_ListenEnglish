import { Route, Routes } from "react-router-dom";
import Home from "../page/Home";
import Lesson from "../page/Lesson";
import LessonDetail from "../page/LessonDetail";
import Speaking from "../page/Speaking";
import LoginAdmin from "../page/admin/login";
import Blog from "../page/Blog";
import BlogDetail from "../page/BlogDetail";
import Login from "../page/Login";
import Profile from "../page/Profile";

export const Client = () => {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:blog_id" element={<BlogDetail />} />
        <Route path="/lesson/:topic_id" element={<Lesson />} />
        <Route path="/lesson/detail/:lesson_id" element={<LessonDetail />} />
        <Route path="/lesson/speaking/:lesson_id" element={<Speaking />} />
        <Route path="/profile/:user_id" element={<Profile />} />
        <Route path="/loginAdmin" element={<LoginAdmin />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    );
  };