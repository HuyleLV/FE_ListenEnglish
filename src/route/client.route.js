import { Route, Routes } from "react-router-dom";
import Home from "../page/Home";
import Lesson from "../page/Lesson";
import LessonDetail from "../page/LessonDetail";

export const Client = () => {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson/:topic_id" element={<Lesson />} />
        <Route path="/lesson/detail/:lesson_id" element={<LessonDetail />} />
      </Routes>
    );
  };