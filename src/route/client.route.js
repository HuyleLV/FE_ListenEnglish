import { Route, Routes } from "react-router-dom";
import Lesson from "../page/Lesson";
import LessonDetail from "../page/LessonDetail";
import LoginAdmin from "../page/admin/login";
import Blog from "../page/Blog";
import BlogDetail from "../page/BlogDetail";
import Login from "../page/Login";
import Profile from "../page/Profile";
import Topic from "../page/Topic";
import Home from "../page/Home";
import RankingStreak from "../page/RankingStreak";
import RankingTimer from "../page/RankingTimer";
import Speaking from "../page/Speaking";
import Playlist from "../page/Playlist";
import LessonPlaylist from "../page/LessonPlaylist";
import PlaylistDetail from "../page/PlaylistDetail";

export const Client = () => {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topic" element={<Topic />} />
        <Route path="/ranking/streak" element={<RankingStreak />} />
        <Route path="/ranking/timer" element={<RankingTimer/>} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/playlist/:id" element={<LessonPlaylist />} />
        <Route path="/playlist/detail/:id" element={<PlaylistDetail />} />
        <Route path="/lesson/:slug" element={<Lesson />} />
        <Route path="/lesson/detail/:slug" element={<LessonDetail />} />
        <Route path="/lesson/speaking/:slug" element={<Speaking />} />
        <Route path="/profile/:user_id" element={<Profile />} />
        <Route path="/loginAdmin" element={<LoginAdmin />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    );
  };
