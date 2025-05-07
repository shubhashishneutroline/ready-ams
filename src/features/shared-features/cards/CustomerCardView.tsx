import React from "react";
import {
  Card,
  Typography,
  Avatar,
  Box,
  Stack,
  Divider,
  Grid,
} from "@mui/material";

import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CakeIcon from "@mui/icons-material/Cake";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BadgeIcon from "@mui/icons-material/Badge";
import { CustomerDataTableRowActions } from "../table/datatable-row-actions/customerdatatable-row-actions";

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
  user: User[];
}

const CustomerCardView = ({ user }: CustomerCardViewProps) => {
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
      spacing={3}
      className="justify-around overflow-y-auto scrollbar py-4"
    >
      {user?.map((user: User, index: number) => (
        <Grid component="div" key={index}>
          <Card
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 4,
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.2)",
              },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  bgcolor: "#F5F5F5",
                  color: "#287AFF",
                  fontSize: { xs: 18, sm: 22 },
                  fontWeight: 600,
                }}
              >
                {user.fullName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </Avatar>

              <Box>
                <Typography
                  fontWeight={600}
                  sx={{
                    color: "#333",
                    fontSize: { xs: "1rem", sm: "1.1rem", lg: "1.2rem" },
                  }}
                >
                  {user.fullName}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <BadgeIcon sx={{ color: "gray", fontSize: "18px" }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize={{ xs: "0.75rem", sm: "0.85rem" }}
                  >
                    Created by {user.createdBy}
                  </Typography>
                </Stack>
              </Box>

              <Box ml="auto">
                <CustomerDataTableRowActions row={user} />
              </Box>
            </Stack>

            <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />

            <Stack spacing={1.2} mt={1}>
              <InfoRow
                icon={
                  <AlternateEmailIcon
                    sx={{ fontSize: "18px", color: "gray" }}
                  />
                }
                label="Email"
                value={user.email}
              />
              <InfoRow
                icon={
                  <LocalPhoneIcon sx={{ fontSize: "18px", color: "gray" }} />
                }
                label="Phone"
                value={user.phoneNumber}
              />
              <InfoRow
                icon={<CakeIcon sx={{ fontSize: "18px", color: "gray" }} />}
                label="Birth"
                value={formatDate(user.dateOfBirth)}
              />
              <InfoRow
                icon={
                  <EventAvailableIcon
                    sx={{ fontSize: "18px", color: "gray" }}
                  />
                }
                label="Appointments"
                value={`${user.totalAppointments} (Last: ${formatDateTime(
                  user.lastAppointment
                )})`}
              />
            </Stack>
          </Card>
        </Grid>
      ))}
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
      {icon}
    </Box>
    <Typography
      variant="body2"
      sx={{
        fontWeight: 500,
        color: "#333",
        fontSize: { xs: "0.8rem", sm: "0.85rem" },
        minWidth: 75,
      }}
    >
      {label}:
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
    >
      {value}
    </Typography>
  </Stack>
);

export default CustomerCardView;
