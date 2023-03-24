
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import Home from "./components/Home/Home"
import ResponsiveAppBar from './components/NavBar/NavBar';
import ProjectDetail from './components/ProjectDetail/ProjectDetail';
import SignUpCard from "./components/SignUp/SignUp.components";
import LoginCard from "./components/LogIn/LogIn.components";
import UserProfile from "./components/UserProfile/UserProfile.components";
import OtpVerificationCard from "./components/OtpVerification/OtpVerification.components";
import NoDataFound from './components/NoDataFound/NoDataFound';
import { UserContext } from "./contexts/UserContext.js";
import Protected from "./Protected";
import './App.scss';


function App() {

  // Fetch User Session details from Context.
  const { user } = useContext(UserContext);
  const token = user?.token
  const isLoggedIn = token && token.length !== 0 ? true : false;

  return (
    <>
      <Routes>
        <Route exact path="/login" element={<LoginCard />} />
        <Route exact path="/signup" element={<SignUpCard />} />
        <Route exact path="/" element={<LoginCard />} />
        <Route exact path="/home"
          element={
            <Protected
              Protected isLoggedIn={isLoggedIn}>
              <ResponsiveAppBar />
              <Home />
            </Protected>} />
        <Route exact path="/project-detail/:id"
          element={
            <Protected
              isLoggedIn={isLoggedIn}>
              <ResponsiveAppBar />
              <ProjectDetail />
            </Protected>} />
        <Route exact path="/users/profile"
          element={
            <Protected
              isLoggedIn={isLoggedIn}>
              <ResponsiveAppBar />
              <UserProfile />
            </Protected>} />
        <Route exact path="/verification"
          element={
            <OtpVerificationCard />} />
        <Route path="*" element={<NoDataFound />} />
      </Routes>
    </>

  );
}

export default App;