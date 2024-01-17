import { Route, Routes } from "react-router-dom";
import Home from "../page/Home";
import BlogDashboard from "../page/admin/blog";
import UsersDashboard from "../page/admin/user";
import BlogDetail from "../page/admin/blog/detail";
import LessonDashboard from "../page/admin/lesson";
import TopicDashboard from "../page/admin/topic";
import TopicDetail from "../page/admin/topic/detail";
import LessonDetail from "../page/admin/lesson/detail";

export const Admin = () => {
    return (
      <Routes>
        <Route path="/admin/blog" element={<BlogDashboard />} />
        <Route path="/admin/blog/:blog_id" element={<BlogDetail />} />
        <Route path="/admin/lesson" element={<LessonDashboard />} />
        <Route path="/admin/lesson/:lesson_id" element={<LessonDetail />} />
        <Route path="/admin/topic" element={<TopicDashboard />} />
        <Route path="/admin/topic/:topic_id" element={<TopicDetail />} />
        <Route path="/admin/user" element={<UsersDashboard />} />
      </Routes>
    );
  };