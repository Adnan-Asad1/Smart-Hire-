import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import ResetPassword from './Components/ResetPassword';
import { Toaster } from 'react-hot-toast';
import VerifyOtpReset from './Components/VerifyotpReset';
import DashBoard from './Components/DashBoard';
import QuestionGenerate from './Components/QuestionGenerate';
import ReviewInterview from './Components/ReviewInterview';
import BuildInterview from './Components/BuildInterview';
import ResumeUpload from './Components/ResumeUpload';
import JoinMeeting from './Components/JoinMeeting';
import ResumeResult from './Components/ResumeResult';
import InterviewSession from './Components/InterviewSession';
import ThankYouPage from './Components/ThankYouPage';
import AllCreatedInterviews from './Components/AllCreatedInterviews';

import ConductedInterviewDetail from './Components/ConductedInterviewDetail';
import InterviewDetailCard from './Components/InterviewDetailCard';
import FeedbackPage from './Components/FeedbackPage';
import EmployeeRegistration from './Components/EmployeeRegistration';
import GetAllEmployees from './Components/GetAllEmployees';
import ProjectDescription from './Components/ProjectDescription';
import ProjectTeamResult from './Components/ProjectTeamResult';
import AdminLogin from './Components/AdminLogin';
import EmployeeLogin from './Components/EmployeeLogin';
import AdminDashboard from './Components/AdminDashboard';
import AdminEmployees from './Components/AdminEmployees';
import AdminHR from './Components/AdminHR';
import AdminInterviews from './Components/AdminInterviews';
import AdminHRInterviews from './Components/AdminHRInterviews';
import AdminHRInterviewDetail from './Components/AdminHRInterviewDetail';
import EmployeeDashboard from './Components/EmployeeDashboard';
import Billing from './Components/Billing';
import LeavePage from './Components/LeavePage';
import PendingLeaves from './Components/PendingLeaves';
import HRProjectsPage from './Components/HRProjectsPage';
import EmployeeProjectsTasks from './Components/EmployeeProjectsTasks';
import EmployeeDocumentsPage from './Components/EmployeeDocumentsPage';
import HRDocumentsPage from './Components/HRDocumentsPage';
import HRTrainingPage from './Components/HRTrainingPage';
import AdminCreateInvite from './Components/AdminCreateInvite';
import ThankYouPageRegistration from './Components/ThankYouPageRegistration';
import AssemblyAiLive from './Components/AssemblyAiLive';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
path:'/AdminLogin',
element:<AdminLogin/>
  },
  {
path:'/EmployeeLogin',
element:<EmployeeLogin/>
  },
  {
    path:'/HrRegistrationPage',
    element:<SignUp/>
  },
  {
    path:'/ResetPassword',
    element:<ResetPassword/>
  },{
    path:'/VerfiyOtpAndRest',
    element:<VerifyOtpReset/>
  },{
    path:'/DashBoard',
    element:<DashBoard/>
  },{
    path:'/generateQuestion',
    element:<QuestionGenerate/>
  },{
    path:'/ReviewInterview',
    element:<ReviewInterview/>
  },{
    path:'/BuildInterview',
    element:<BuildInterview/>
  },{
    path:'/ResumeUpload',
    element:<ResumeUpload/>
  },{
    path:'/interview/:interviewId',
    element:<JoinMeeting/>
  },{
    path:'/PredictInterview',
    element:<ResumeUpload/>
  },{
    path:'/ResumeResult',
    element:<ResumeResult/>
  },{
    path:'/InterviewSession',
    element:<InterviewSession/>
  },{
    path:'/thankyou',
    element:<ThankYouPage/>
  },{
    path:'/AllCreatedInterviews',
    element:<AllCreatedInterviews/>
  },
  {
    path:'InterviewDetail',
    element:<InterviewDetailCard/>
  },{
    path:'/ConductedInterviewDetail',
    element:<ConductedInterviewDetail/>
  },{
    path:'/FeedbackPage',
    element:<FeedbackPage/>
  },{
    path:'/EmployeeRegistrationPage',
    element:<EmployeeRegistration/>
  },{
    path:'/getAllEmployees',
    element:<GetAllEmployees/>
  },{
    path:'/ProjectDsecription',
    element:<ProjectDescription/>
  },{
    path:'/project-team-result',
    element:<ProjectTeamResult/>
  },{
    path:'AdminDashboard',
    element:<AdminDashboard/>
  },{
    path:'/AdminEmployees',
    element:<AdminEmployees/>
  },{
    path:'/AdminHR',
    element:<AdminHR/>
  },{
    path:'/AdminInterviews',
    element:<AdminInterviews/>
  },{
    path:'/AdminHRInterviews',
    element:<AdminHRInterviews/>
  },{
    path:'/AdminHRInterviewDetail',
    element:<AdminHRInterviewDetail/>
  },{
    path:'/EmployeeDashboard',
    element:<EmployeeDashboard/>
  },{
    path:'/Billing',
    element:<Billing/>
  },{
    path:'/LeavePage',
    element:<LeavePage/>
  },{
    path:'/PendingLeaves',
    element:<PendingLeaves/>
  },{
    path:'/HRProjectsPage',
    element:<HRProjectsPage/>
  },{
    path:'/EmployeeProjectsTasks',
    element:<EmployeeProjectsTasks/>
  },{
    path:'/EmployeeDocumentsPage',
    element:<EmployeeDocumentsPage/>
  },{
    path:'/HRDocumentsPage',
    element:<HRDocumentsPage/>
  },{
    path:'/HRTrainingPage',
    element:<HRTrainingPage/>
  },{
    path:'/AdminRegistrationInvite',
    element:<AdminCreateInvite/>
  },{
    path:'/ThankYouPageRegistration',
    element:<ThankYouPageRegistration/>
  },{
    path:'/AssemblyAiLive',
    element:<AssemblyAiLive/>
  }
]);

function App() {
  return (
<>

<RouterProvider router={router} />;
 <Toaster position="top-right" reverseOrder={false} />

</>

  )
}

export default App;
