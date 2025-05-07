import React from "react";
import {
  Card,
  Typography,
  Avatar,
  Box,
  Stack,
  Divider,
  Icon,
  Grid,
} from "@mui/material";

import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CakeIcon from "@mui/icons-material/Cake";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BadgeIcon from "@mui/icons-material/Badge";
import { AppointmentDataTableRowActions } from "../table/datatable-row-actions/appointmentdatatable-row-actions";

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  totalAppointments: number;
  lastAppointment: string;
  createdBy: string;
}
interface CustomerCardViewProps {
  user: User[]; // Ensure the prop type is an array of users
}
const AppointmentCardView = ({ user }: CustomerCardViewProps) => {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  return (
    <Grid
      container
      spacing={4}
      className="justify-center max-h-[480px] overflow-y-auto scrollbar"
    >
      {user?.map((user: any, index: number) => {
        return (
          <Grid component="div" key={index}>
            <Card
              sx={{
                minWidth: "100%",
                mx: "auto",
                borderRadius: 4,
                boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                backgroundColor: "#fff",
                p: 3,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <div className="flex w-full justify-between">
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: "#F5F5F5",
                      color: "#333",
                      fontSize: 24,
                    }}
                  >
                    {user.fullName
                      .split(" ")
                      .map((n: any) => n[0])
                      .join("")}
                  </Avatar>

                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {user.fullName}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <BadgeIcon fontSize="small" sx={{ color: "gray" }} />
                      <Typography variant="body2" color="text.secondary">
                        Created by {user.createdBy}
                      </Typography>
                    </Stack>
                  </Box>
                  <AppointmentDataTableRowActions row={user} />
                </div>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.5}>
                <InfoRow
                  icon={<AlternateEmailIcon />}
                  label="Email"
                  value={user.email}
                />
                <InfoRow
                  icon={<LocalPhoneIcon />}
                  label="Phone"
                  value={user.phoneNumber}
                />
                <InfoRow
                  icon={<CakeIcon />}
                  label="Birth"
                  value={formatDate(user.dateOfBirth)}
                />
                <InfoRow
                  icon={<EventAvailableIcon />}
                  label="Appointments"
                  value={`${user.totalAppointments} (Last: ${formatDateTime(
                    user.lastAppointment
                  )})`}
                />
              </Stack>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Box color="gray" display="flex" alignItems="center">
      <Icon>{icon}</Icon>
    </Box>
    <Typography variant="body2" sx={{ minWidth: 70, fontWeight: 500 }}>
      {label}:
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {value}
    </Typography>
  </Stack>
);
export default AppointmentCardView;
