import HomeIcon from "@mui/icons-material/Home";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GroupIcon from "@mui/icons-material/Group";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import Header from "@/features/shared-features/header/header";
import { SideBarProps } from "@/features/shared-features/sidebar/mobilesidebar";
import ResponsiveSidebar from "@/features/shared-features/sidebar/responsivesidebar";
import AddUserForm from "@/features/form-components/form-method/add/AddUserForm";
import AddAppointmentForm from "@/features/form-components/form-method/add/AddAppointmentForm";
import EditUserForm from "@/features/form-components/form-method/edit/EditUserForm";
import AddServiceForm from "@/features/form-components/form-method/add/AddServiceForm";
import AddNotificationForm from "@/features/form-components/form-method/add/AddNotificaitonForm";
import AddBusinessPage from "@/features/form-components/form-method/add/AddBusinessForm";
import AddBusinessAvailabilityForm from "@/features/form-components/form-method/add/AddBusinessAvailabilityForm";
import EditAppointmentForm from "@/features/form-components/form-method/edit/EditAppointment";
import EditServiceForm from "@/features/form-components/form-method/edit/EditServiceForm";
import AddFAQ from "@/features/form-components/forms/admin/support/AddFAQ";
import EditFAQ from "@/features/form-components/form-method/edit/EditFAQ";
import AddTicket from "@/features/form-components/forms/admin/support/AddTicketForm";
import SupportAndFaqPage from "@/features/form-components/form-method/add/AddSupportandFAQ";
import BusinessDetailsPage from "@/features/form-components/form-method/add/AddBusinessDetail";
import AddResources from "@/features/form-components/form-method/add/AddResources";
import EditStaffResources from "@/features/form-components/form-method/edit/EditResources";
import EditTicket from "@/features/form-components/form-method/edit/EditTicket";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebarData: SideBarProps = {
    title: "Customer Name ",
    menus: [
      {
        menu: "Dashboard",
        icon: (
          <HomeRoundedIcon
            sx={{
              fontSize: {
                xs: "20px",
                sm: "23px",
                lg: "28px",
                xl: "30px",
              },
            }}
          />
        ),
        path: "/admin",
      },
      {
        menu: "Appointments",
        icon: (
          <CalendarMonthOutlinedIcon
            sx={{
              fontSize: {
                xs: "20px",
                sm: "23px",
                lg: "28px",
                xl: "30px",
              },
            }}
          />
        ),
        path: "/admin/appointments",
      },
      {
        menu: "Customer",
        icon: (
          <GroupIcon
            sx={{
              fontSize: {
                xs: "20px",
                sm: "23px",
                lg: "28px",
                xl: "30px",
              },
            }}
          />
        ),
        path: "/admin/customer",
      },
      {
        menu: "Availability and Scheduling",
        icon: (
          <PendingActionsIcon
            sx={{
              fontSize: {
                xs: "20px",
                sm: "23px",
                lg: "28px",
                xl: "30px",
              },
            }}
          />
        ),
        path: "/admin/scheduling",
      },
      {
        menu: "Serivces",
        icon: (
          <DesignServicesIcon
            sx={{
              fontSize: {
                xs: "20px",
                sm: "23px",
                lg: "28px",
                xl: "30px",
              },
            }}
          />
        ),
        path: "/admin/services",
      },
      {
        menu: "Buisness Setting",
        icon: (
          <SettingsIcon
            sx={{
              fontSize: {
                xs: "20px",
                sm: "23px",
                lg: "28px",
                xl: "30px",
              },
            }}
            className=""
          />
        ),
        path: "/admin/businesssetting",
      },
      {
        menu: "Notification and Reminder",
        icon: (
          <NotificationsIcon
            sx={{
              fontSize: {
                xs: "20px",
                sm: "23px",
                lg: "28px",
                xl: "30px",
              },
            }}
          />
        ),
        path: "/admin/notification",
      },
      {
        menu: "Support and Help",
        icon: (
          <HeadsetMicIcon
            sx={{
              fontSize: {
                xs: "20px",
                sm: "23px",
                lg: "28px",
                xl: "30px",
              },
            }}
          />
        ),
        path: "/admin/support",
      },
    ],
  };
  return (
    <div className="h-screen w-screen relative flex">
      <ResponsiveSidebar title={sidebarData.title} menus={sidebarData.menus} />
      <div className="flex-1">
        <Header
          icon={<HomeIcon className="text-white" />}
          pageTitle="Dashboard"
        />
        <AddAppointmentForm />
        <AddUserForm />
        <EditUserForm />
        <AddServiceForm />
        <AddNotificationForm />
        <SupportAndFaqPage />
        <AddBusinessPage />
        <AddBusinessAvailabilityForm />
        <EditAppointmentForm />
        <EditServiceForm />
        <AddFAQ />
        <EditFAQ />
        <AddTicket />
        <BusinessDetailsPage />
        <AddResources />
        <EditStaffResources />
        <EditTicket />

        <div
          className="absolute  min-h-[calc(100vh-376px)] lg:ml-[90px]
        w-full lg:min-w-[100vw] py-4 px-3 md:px-4 overflow-t-auto"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
