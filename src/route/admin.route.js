import {Route, Routes} from "react-router-dom";
import BlogDashboard from "../page/admin/blog";
import UsersDashboard from "../page/admin/user";
import BlogDetail from "../page/admin/blog/detail";
import LessonDashboard from "../page/admin/lesson";
import TopicDashboard from "../page/admin/topic";
import TopicDetail from "../page/admin/topic/detail";
import LessonDetail from "../page/admin/lesson/detail";
import TransferDetail from "../page/admin/transfer";
import CourseDashboard from "../page/admin/course";
import CourseDetail from "../page/admin/course/detail";

export const Admin = () => {
    return (
        <Routes>
            <Route path="/admin/blog" element={<BlogDashboard/>}/>
            <Route path="/admin/blog/:slug" element={<BlogDetail/>}/>
            <Route path="/admin/lesson" element={<LessonDashboard/>}/>
            <Route path="/admin/lesson/:slug" element={<LessonDetail/>}/>
            <Route path="/admin/topic" element={<TopicDashboard/>}/>
            <Route path="/admin/topic/:slug" element={<TopicDetail/>}/>
            <Route path="/admin/course" element={<CourseDashboard/>}/>
            <Route path="/admin/course/:slug" element={<CourseDetail/>}/>
            <Route path="/admin/transfer" element={<TransferDetail/>}/>
            <Route path="/admin/user" element={<UsersDashboard/>}/>
        </Routes>
    );
};
