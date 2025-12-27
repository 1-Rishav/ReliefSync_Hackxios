import { Navigate, useRoutes } from "react-router-dom";

import Auth from "../layouts/Auth";

import Login from "../auth/Login";
import Signup from "../auth/Signup";
import VerifyEmail from "../auth/VerifyEmail";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword"
import NGO_Verification from '../auth/NGO_Verification';
import GOV_Verification from '../auth/GOV_Verification';
import NgoWaitlistPage from "../pages/AuthPages/NgoWaitlistPage";
import DashboardPage from "../pages/AuthPages/DashboardPage"
import AgentWaitlistPage from "../pages/AuthPages/AgentWaitlistPage";

import Admin from "../layouts/Admin";
import AdminHomePage from "../pages/AdminPages/AdminHomePage";
import NGOVerificationPage from "../pages/AdminPages/NGOVerificationPage";
import AgentStatus from "../pages/AdminPages/AgentStatusPage";
import NGOStatusPage from "../pages/AdminPages/NGOStatusPage";
import ActiveAllocation from "../pages/AdminPages/ActiveAllocationPage";
import AgentVerificationPage from "../pages/AdminPages/AgentVerificationPage";

import Citizen from "../layouts/Citizen";
import CitizenHomePage from "../pages/CitizenPages/CitizenHomePage"
import HelpDeskPage from "../pages/CitizenPages/HelpDeskPage";

import Gov_Agency from "../layouts/Gov_Agency";
import AgentHomePage from "../pages/Gov_AgencyPages/AgentHomePage"

import NGO from "../layouts/NGO";
import NGOHomePage from "../pages/NGOPages/NGOHomePage"

import ProtectedRoute from "../layouts/ProtectedRoute";
import HelpRequestPage from "../pages/CommonPages/HelpRequestPage";
import DeliveredPage from "../pages/CommonPages/DeliveredPage";
import EventTablePage from "../pages/CommonPages/EventTablePage";
import DisasterReportPage from "../pages/CommonPages/DisasterReportPage";
import UserProfilePage from "../pages/CommonPages/UserProfilePage";
import AllocatedTaskPage from "../pages/CommonPages/AllocatedTaskPage";
import UrgentVoiceMailPage from "../pages/CommonPages/UrgentVoiceMailPage";


const Router = () => {
    return useRoutes([
        {
            path: '/auth',
            element: <Auth />,
            children: [
                { index: true, element: <Login /> },
                //{ path: '', element: <Login /> },
                { path: "signup", element: <Signup /> },
                { path: "verify", element: <VerifyEmail /> },
                { path: "forgot-password", element: <ForgotPassword /> },
                { path: "reset-password", element: <ResetPassword /> },
                { path: "agency-verification", element: (<ProtectedRoute><GOV_Verification /></ProtectedRoute>) },
                { path: "ngo-verification", element: (<ProtectedRoute><NGO_Verification /></ProtectedRoute>) },
                { path: 'ngo_waitlist', element: (<ProtectedRoute><NgoWaitlistPage /></ProtectedRoute>) },
                { path: 'profile', element: (<ProtectedRoute><UserProfilePage /></ProtectedRoute>) },
                { path: 'dashboard', element: (<ProtectedRoute><DashboardPage /></ProtectedRoute>) },
                { path: 'agent_waitlist', element: (<ProtectedRoute><AgentWaitlistPage /></ProtectedRoute>) },

            ]
        },
        {
            path: '/admin',
            element: <Admin />,
            children: [
                { path: '', element: <AdminHomePage /> },
                { path: 'profile', element: <UserProfilePage /> },
                { path: 'disaster-report', element: <DisasterReportPage /> },
                { path: 'helpRequest', element: <HelpRequestPage /> },
                { path: 'ngo-verification', element: <NGOVerificationPage /> },
                { path: 'delivered', element: <DeliveredPage /> },
                { path: 'agent-verification', element: <AgentVerificationPage /> },
                { path: 'agent-status', element: <AgentStatus /> },
                { path: 'ngo-status', element: <NGOStatusPage /> },
                { path: 'allocated-task', element: <ActiveAllocation /> },
                { path: 'events', element: <EventTablePage /> }
            ]
        },
        {
            path: '/',
            element: <Citizen />,
            children: [
                { path: '', element: <CitizenHomePage /> },
                { path: 'profile', element: <UserProfilePage /> },
                { path: 'disaster-report', element: <DisasterReportPage /> },
                { path: 'help', element: <HelpDeskPage /> },
                { path: 'helpRequest', element: <HelpRequestPage /> },
                { path: 'delivered', element: <DeliveredPage /> },
                { path: 'urgent-voice-mail', element: <UrgentVoiceMailPage /> },
                { path: 'events', element: <EventTablePage /> }

            ]
        },
        {
            path: '/gov_agency',
            element: <Gov_Agency />,
            children: [
                { path: '', element: <AgentHomePage /> },
                { path: 'profile', element: <UserProfilePage /> },
                { path: 'disaster-report', element: <DisasterReportPage /> },
                { path: 'help', element: <HelpDeskPage /> },
                { path: 'helpRequest', element: <HelpRequestPage /> },
                { path: 'delivered', element: <DeliveredPage /> },
                { path: 'urgent-voice-mail', element: <UrgentVoiceMailPage /> },
                { path: 'events', element: <EventTablePage /> },
                { path: 'task', element: <AllocatedTaskPage /> },


            ]
        },
        {
            path: '/ngo',
            element: <NGO />,
            children: [
                { path: '', element: <NGOHomePage /> },
                { path: 'profile', element: <UserProfilePage /> },
                { path: 'disaster-report', element: <DisasterReportPage /> },
                { path: 'help', element: <HelpDeskPage /> },
                { path: 'helpRequest', element: <HelpRequestPage /> },
                { path: 'delivered', element: <DeliveredPage /> },
                { path: 'urgent-voice-mail', element: <UrgentVoiceMailPage /> },
                { path: 'events', element: <EventTablePage /> },
                { path: 'task', element: <AllocatedTaskPage /> },
            ]
        },
        { path: "*", element: <Navigate to="/404" replace /> },

    ])
}
export default Router;