import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute, { GuestRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import PostDetail from "./pages/PostDetail";
import Notifications from "./pages/Notifications";
import FollowList from "./pages/FollowList";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Feed />} />
        <Route path="explore" element={<Explore />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="post/:id" element={<PostDetail />} />
        <Route path="u/:username" element={<Profile />} />
        <Route path="u/:username/followers" element={<FollowList type="followers" />} />
        <Route path="u/:username/following" element={<FollowList type="following" />} />
        <Route path="settings/profile" element={<EditProfile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
