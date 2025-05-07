import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "../../features/reminder/types/types";
import {
  AdminSliceSchema,
  InitialServiceData,
  //   AdminCustomerFormSchema,
  //   ServiceType,
  //   APiType,
} from "./admin";
import {
  createAnnouncement,
  createAppointment,
  createReminder,
  createService,
  createSupportBusinessDetails,
  createTicket,
  createUser,
  retrieveBusiness,
  retriveAnnouncement,
  retriveAppointment,
  retriveFAQ,
  retriveReminder,
  retriveService,
  retriveStaff,
  retriveTicket,
  retriveUsers,
  updateAnnouncement,
  updateAppointment,
  updateReminder,
  updateTicket,
  updateUser,
} from "./AdminServices";

const API_URL = process.env.DATABASE_URL;

export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await fetch(`${API_URL}/users`); // ✅ Use API URL
  return await response.json();
});

const initialState: AdminSliceSchema = {
  platform: {
    user: {
      _add_CustomerForm: {
        id: null,
        input: {
          name: "",
          email: "",
          phone: "",
          role: "",
          isActive: false,
          password: "",
          street: "",
          city: "",
          country: "",
          zipCode: "",
        },
        details: [],
      },
      _edit_CustomerForm: {
        id: null,
        input: {
          name: "",
          email: "",
          phone: "",
          role: "",
          isActive: false,
          password: "",
          street: "",
          city: "",
          country: "",
          zipCode: "",
        },
        details: [],
      },
      _view_CustomerForm: {
        id: null,
        input: {
          name: "",
          email: "",
          phone: "",
          role: "",
          isActive: false,
          password: "",
          street: "",
          city: "",
          country: "",
          zipCode: "",
        },
        details: [],
      },
    },
    appointment: {
      _add_AppointmentForm: {
        id: null,
        input: {
          firstName: "",
          lastName: "",

          email: "",
          phone: "",
          status: "",
          serviceId: "",
          selectedDate: "",
          selectedTime: "",
          createdById: "",
          isForSelf: true,
          message: "",
          user: {
            id: "",
            email: "",
            name: "",
            password: "",
            phone: "",
            createdAt: "",
            updatedAt: "",
            lastActive: "",
            role: "",
            isActive: false,
          },
        },
        details: [],
      },
      _edit_AppointmentForm: {
        id: null,
        input: {
          firstName: "",
          lastName: "",

          email: "",
          phone: "",
          status: "",
          serviceId: "",
          selectedDate: "",
          selectedTime: "",
          createdById: "",
          isForSelf: true,
          message: "",
          user: {
            id: "",
            email: "",
            name: "",
            password: "",
            phone: "",
            createdAt: "",
            updatedAt: "",
            lastActive: "",
            role: "",
            isActive: false,
          },
        },
        details: [],
      },
      _view_AppointmentForm: {
        id: null,
        input: {
          firstName: "",
          lastName: "",

          email: "",
          phone: "",
          status: "",
          serviceId: "",
          selectedDate: "",
          selectedTime: "",
          createdById: "",
          isForSelf: true,
          message: "",
          user: {
            id: "",
            email: "",
            name: "",
            password: "",
            phone: "",
            createdAt: "",
            updatedAt: "",
            lastActive: "",
            role: "",
            isActive: false,
          },
        },
        details: [],
      },
    },
    service: {
      _add_ServiceForm: {
        id: null,
        input: {
          title: "",
          description: "",
          estimatedDuration: "",
          status: "",
          serviceAvailability: [
            {
              weekDay: "",
              timeSlots: [
                {
                  startTime: "",
                  endTime: "",
                },
              ],
            },
          ],
        },
        details: [],
      },
      _edit_ServiceForm: {
        id: null,
        input: {
          title: "",
          description: "",
          estimatedDuration: "",
          status: "",
          serviceAvailability: [
            {
              weekDay: "",
              timeSlots: [
                {
                  startTime: "",
                  endTime: "",
                },
              ],
            },
          ],
        },
        details: [],
      },
      _view_ServiceForm: {
        id: null,
        input: {
          title: "",
          description: "",
          estimatedDuration: "",
          status: "",
          serviceAvailability: [
            {
              weekDay: "",
              timeSlots: [
                {
                  startTime: "",
                  endTime: "",
                },
              ],
            },
          ],
        },
        details: [],
      },
    },
    notification: {
      _add_ServiceForm: {
        id: null,
        input: {
          title: "",
          description: "",
          estimatedDuration: "",
          status: "",
          serviceAvailability: [
            {
              weekDay: "",
              timeSlots: [
                {
                  startTime: "",
                  endTime: "",
                },
              ],
            },
          ],
        },
        details: [],
      },
      _edit_ServiceForm: {
        id: null,
        input: {
          title: "",
          description: "",
          estimatedDuration: "",
          status: "",
          serviceAvailability: [
            {
              weekDay: "",
              timeSlots: [
                {
                  startTime: "",
                  endTime: "",
                },
              ],
            },
          ],
        },
        details: [],
      },
      _view_ServiceForm: {
        id: null,
        input: {
          title: "",
          description: "",
          estimatedDuration: "",
          status: "",
          serviceAvailability: [
            {
              weekDay: "",
              timeSlots: [
                {
                  startTime: "",
                  endTime: "",
                },
              ],
            },
          ],
        },
        details: [],
      },
    },
    faq: {
      _add_FAQForm: {
        id: null,
        input: {
          question: "",
          answer: "",
        },
        details: [],
      },
      _edit_FAQForm: {
        id: null,
        input: {
          question: "",
          answer: "",
        },
        details: [],
      },
      _view_FAQForm: {
        id: null,
        input: {
          question: "",
          answer: "",
        },
        details: [],
      },
    },
    resource: {
      _add_ResourceForm: {
        id: null,
        input: {
          name: "",
          email: "",
          phone: "",
          role: "",
          address: "",
          service: [{ id: "" }],
        },
        details: [],
      },
      _edit_ResourceForm: {
        id: null,
        input: {
          name: "",
          email: "",
          phone: "",
          role: "",
          address: "",
          service: [{ id: "" }],
        },
        details: [],
      },
      _view_ResourceForm: {
        id: null,
        input: {
          name: "",
          email: "",
          phone: "",
          role: "",
          address: "",
          service: [{ id: "" }],
        },
        details: [],
      },
    },
    ticket: {
      _add_TicketForm: {
        id: null,
        input: {
          userType: "",
          subject: "",
          ticketDescription: "",
          category: "",
          priority: "",
          status: "",
          userId: "",
        },
        details: [],
      },
      _edit_TicketForm: {
        id: null,
        input: {
          userType: "",
          subject: "",
          ticketDescription: "",
          category: "",
          priority: "",
          status: "",
          userId: "",
        },
        details: [],
      },
      _view_TicketForm: {
        id: null,
        input: {
          userType: "",
          subject: "",
          ticketDescription: "",
          category: "",
          priority: "",
          status: "",
          userId: "",
        },
        details: [],
      },
    },
  },
  admin: {
    user: InitialServiceData,
    sidebar: InitialServiceData,
    appointment: InitialServiceData,
    service: InitialServiceData,
    notification: InitialServiceData,
    support: InitialServiceData,
    business: InitialServiceData,
    availability: InitialServiceData,
    faq: InitialServiceData,
    ticket: InitialServiceData,
    businessDetails: InitialServiceData,
    resources: {
      staff: InitialServiceData,
      admin: InitialServiceData,
    },
    supportBusinessDetails: InitialServiceData,

    reminder: InitialServiceData,
    announcement: InitialServiceData,
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAddCustomerFormTrue: (state, action) => {
      state.admin.user.add.isFlag = action.payload;
    },
    setAddAppointmentFormTrue: (state, action) => {
      state.admin.appointment.add.isFlag = action.payload;
    },
    setAddServiceFormTrue: (state, action) => {
      state.admin.service.add.isFlag = action.payload;
    },
    setOpenSidebarTrue: (state, action) => {
      state.admin.sidebar.add.isFlag = action.payload;
    },
    setCustomerView: (state, action) => {
      state.admin.user.viewType.view = action.payload;
    },
    setAppointmentView: (state, action) => {
      state.admin.appointment.viewType.view = action.payload;
    },
    setServiceView: (state, action) => {
      state.admin.service.viewType.view = action.payload;
    },
    resetUserState: (state) => {
      state.admin.user.add.response = {
        ...state.admin.user.add.response,
        isLoading: false,
        isSuccess: false,
        toastMsg: "",
        error: "",
      };
    },
    setEditCustomerFormTrue: (state, action) => {
      state.admin.user.edit.isFlag = action.payload;
    },
    setEditAppointmentFormTrue: (state, action) => {
      state.admin.appointment.edit.isFlag = action.payload;
    },
    setEditCustomerId: (state, action) => {
      state.platform.user._edit_CustomerForm.id = action.payload;
    },
    setEditAppointmentId: (state, action) => {
      state.platform.appointment._edit_AppointmentForm.id = action.payload;
    },
    setAddNotificationFormTrue: (state, action) => {
      state.admin.notification.add.isFlag = action.payload;
    },
    setAddSupportFormTrue: (state, action) => {
      state.admin.support.add.isFlag = action.payload;
    },
    setAddBusinessFormTrue: (state, action) => {
      state.admin.business.add.isFlag = action.payload;
    },
    setAddAvailabilityFormTrue: (state, action) => {
      state.admin.availability.add.isFlag = action.payload;
    },
    setEditServiceFormTrue: (state, action) => {
      state.admin.service.edit.isFlag = action.payload;
    },
    setEditServiceId: (state, action) => {
      state.platform.service._edit_ServiceForm.id = action.payload;
    },
    setAddFAQFormTrue: (state, action) => {
      state.admin.faq.add.isFlag = action.payload;
    },
    setEditFAQFormTrue: (state, action) => {
      state.admin.faq.edit.isFlag = action.payload;
    },
    setEditFAQId: (state, action) => {
      state.platform.faq._edit_FAQForm.id = action.payload;
    },
    setAddTicketFormTrue: (state, action) => {
      state.admin.ticket.add.isFlag = action.payload;
    },
    setEditTicketFormTrue: (state, action) => {
      state.admin.ticket.edit.isFlag = action.payload;
    },
    setAddBusinessDetailTrue: (state, action) => {
      state.admin.businessDetails.add.isFlag = action.payload;
    },
    setAddStaffResourceTrue: (state, action) => {
      state.admin.resources.staff.add.isFlag = action.payload;
    },
    setEditStaffResourceTrue: (state, action) => {
      state.admin.resources.staff.edit.isFlag = action.payload;
    },
    setEditAdminResourceTrue: (state, action) => {
      state.admin.resources.admin.edit.isFlag = action.payload;
    },
    setAddAdminResourceTrue: (state, action) => {
      state.admin.resources.admin.add.isFlag = action.payload;
    },
    setEditStaffId: (state, action) => {
      state.platform.resource._edit_ResourceForm.id = action.payload;
    },
    setEditTicketTrue: (state, action) => {
      state.admin.ticket.edit.isFlag = action.payload;
    },
    setEditTicketId: (state, action) => {
      state.platform.ticket._edit_TicketForm.id = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // User / Customer
      .addCase(createUser.pending, (state) => {
        state.admin.user.add.response.isLoading = true;
        state.admin.user.add.response.isSuccess = false;
        state.admin.user.add.response.toastMsg = "";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.admin.user.add.response.isLoading = false;
        state.admin.user.add.response.isSuccess = true;
        state.admin.user.add.response.details = action.payload;
        state.admin.user.add.response.toastMsg = "User created successfully!";
      })
      .addCase(createUser.rejected, (state, action) => {
        state.admin.user.add.response.isLoading = false;
        state.admin.user.add.response.isSuccess = false;
        state.admin.user.add.response.toastMsg = "User creation failed.";
        state.admin.user.add.response.error = action.payload as string;
      })
      .addCase(retriveUsers.pending, (state) => {
        state.admin.user.view.response.isLoading = true;
        state.admin.user.view.response.error = null;
      })
      .addCase(retriveUsers.fulfilled, (state, action: PayloadAction<any>) => {
        state.admin.user.view.response.isLoading = false;
        state.admin.user.view.response.details = action.payload; // Save the user data in the state
      })
      .addCase(retriveUsers.rejected, (state, action) => {
        state.admin.user.view.response.isLoading = false;
        state.admin.user.view.response.error = action.payload as string; // Capture error if failed
      })
      .addCase(updateUser.pending, (state) => {
        state.admin.user.edit.response.isLoading = true;
        state.admin.user.edit.response.error = null;
        state.admin.user.add.response.toastMsg = "";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.admin.user.edit.response.isLoading = false;
        state.admin.user.edit.response.isSuccess = true;
        state.admin.user.edit.response.details = action.payload;
        state.admin.user.add.response.toastMsg = "User updated successfully!";
        state.admin.user.edit.response.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.admin.user.edit.response.isLoading = false;
        state.admin.user.edit.response.isSuccess = false;
        state.admin.user.edit.response.toastMsg = "User update failed.";
        state.admin.user.edit.response.error = action.payload as string;
      })

      // Appointment
      .addCase(createAppointment.pending, (state) => {
        state.admin.appointment.add.response.isLoading = true;
        state.admin.appointment.add.response.isSuccess = false;
        state.admin.appointment.add.response.toastMsg = "";
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.admin.appointment.add.response.isLoading = false;
        state.admin.appointment.add.response.isSuccess = true;
        state.admin.appointment.add.response.details = action.payload;
        state.admin.appointment.add.response.toastMsg =
          "User created successfully!";
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.admin.appointment.add.response.isLoading = false;
        state.admin.appointment.add.response.isSuccess = false;
        state.admin.appointment.add.response.toastMsg = "User creation failed.";
        state.admin.appointment.add.response.error = action.payload as string;
      })
      .addCase(retriveAppointment.pending, (state) => {
        state.admin.appointment.view.response.isLoading = true;
        state.admin.appointment.view.response.error = null;
        state.admin.appointment.add.response.toastMsg = "";
      })
      .addCase(
        retriveAppointment.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.admin.appointment.view.response.isLoading = false;
          state.admin.appointment.edit.response.isSuccess = true;
          state.admin.appointment.view.response.details = action.payload; // Save the user data in the state
        }
      )
      .addCase(retriveAppointment.rejected, (state, action) => {
        state.admin.appointment.view.response.isLoading = false;
        state.admin.appointment.edit.response.isSuccess = false;
        state.admin.appointment.edit.response.toastMsg =
          "Appointment update failed.";

        state.admin.appointment.view.response.error = action.payload as string; // Capture error if failed
      })
      .addCase(updateAppointment.pending, (state) => {
        state.admin.appointment.edit.response.isLoading = true;
        state.admin.appointment.edit.response.error = null;
        state.admin.appointment.add.response.toastMsg = "";
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.admin.appointment.edit.response.isLoading = false;
        state.admin.appointment.edit.response.isSuccess = true;
        state.admin.appointment.edit.response.details = action.payload;
        state.admin.appointment.add.response.toastMsg =
          "User updated successfully!";
        state.admin.appointment.edit.response.error = null;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.admin.appointment.edit.response.isLoading = false;
        state.admin.appointment.edit.response.isSuccess = false;
        state.admin.appointment.edit.response.toastMsg = "User update failed.";
        state.admin.appointment.edit.response.error = action.payload as string;
      })

      // Service
      .addCase(createService.pending, (state) => {
        state.admin.service.add.response.isLoading = true;
        state.admin.service.add.response.isSuccess = false;
        state.admin.service.add.response.toastMsg = "";
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.admin.service.add.response.isLoading = false;
        state.admin.service.add.response.isSuccess = true;
        state.admin.service.add.response.details = action.payload;
        state.admin.service.add.response.toastMsg =
          "User created successfully!";
      })
      .addCase(createService.rejected, (state, action) => {
        state.admin.service.add.response.isLoading = false;
        state.admin.service.add.response.isSuccess = false;
        state.admin.service.add.response.toastMsg = "User creation failed.";
        state.admin.service.add.response.error = action.payload as string;
      })
      .addCase(retriveService.pending, (state) => {
        state.admin.service.view.response.isLoading = true;
        state.admin.service.view.response.error = null;
      })
      .addCase(
        retriveService.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.admin.service.view.response.isLoading = false;
          state.admin.service.view.response.details = action.payload; // Save the user data in the state
        }
      )
      .addCase(retriveService.rejected, (state, action) => {
        state.admin.service.view.response.isLoading = false;
        state.admin.service.view.response.error = action.payload as string; // Capture error if failed
      })
      .addCase(retrieveBusiness.pending, (state) => {
        state.admin.business.view.response.isLoading = true;
        state.admin.business.view.response.error = null;
      })
      .addCase(
        retrieveBusiness.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.admin.business.view.response.isLoading = false;
          state.admin.business.view.response.details = action.payload; // Save the user data in the state
        }
      )
      .addCase(retrieveBusiness.rejected, (state, action) => {
        state.admin.business.view.response.isLoading = false;
        state.admin.business.view.response.error = action.payload as string; // Capture error if failed
      })
      .addCase(retriveStaff.pending, (state) => {
        state.admin.resources.staff.view.response.isLoading = true;
        state.admin.resources.staff.view.response.error = null;
        state.admin.resources.staff.add.response.toastMsg = "";
      })
      .addCase(retriveStaff.fulfilled, (state, action: PayloadAction<any>) => {
        state.admin.resources.staff.view.response.isLoading = false;
        state.admin.resources.staff.edit.response.isSuccess = true;
        state.admin.resources.staff.view.response.details = action.payload; // Save the user data in the state
      })
      .addCase(retriveStaff.rejected, (state, action) => {
        state.admin.resources.staff.view.response.isLoading = false;
        state.admin.resources.staff.edit.response.isSuccess = false;
        state.admin.resources.staff.edit.response.toastMsg =
          "Appointment update failed.";

        state.admin.resources.staff.view.response.error =
          action.payload as string; // Capture error if failed
      })
      .addCase(createSupportBusinessDetails.pending, (state) => {
        state.admin.supportBusinessDetails.add.response.isLoading = true;
        state.admin.supportBusinessDetails.add.response.isSuccess = false;
        state.admin.supportBusinessDetails.add.response.toastMsg = "";
      })
      .addCase(createSupportBusinessDetails.fulfilled, (state, action) => {
        state.admin.supportBusinessDetails.add.response.isLoading = false;
        state.admin.supportBusinessDetails.add.response.isSuccess = true;
        state.admin.supportBusinessDetails.add.response.details =
          action.payload;
        state.admin.supportBusinessDetails.add.response.toastMsg =
          "User created successfully!";
      })
      .addCase(createSupportBusinessDetails.rejected, (state, action) => {
        state.admin.supportBusinessDetails.add.response.isLoading = false;
        state.admin.supportBusinessDetails.add.response.isSuccess = false;
        state.admin.supportBusinessDetails.add.response.toastMsg =
          "User creation failed.";
        state.admin.supportBusinessDetails.add.response.error =
          action.payload as string;
      })
      .addCase(retriveFAQ.pending, (state) => {
        state.admin.faq.view.response.isLoading = true;
        state.admin.faq.view.response.error = null;
        state.admin.faq.add.response.toastMsg = "";
      })
      .addCase(retriveFAQ.fulfilled, (state, action: PayloadAction<any>) => {
        state.admin.faq.view.response.isLoading = false;
        state.admin.faq.edit.response.isSuccess = true;
        state.admin.faq.view.response.details = action.payload; // Save the user data in the state
      })
      .addCase(retriveFAQ.rejected, (state, action) => {
        state.admin.faq.view.response.isLoading = false;
        state.admin.faq.edit.response.isSuccess = false;
        state.admin.faq.edit.response.toastMsg = "Appointment update failed.";

        state.admin.resources.staff.view.response.error =
          action.payload as string;
      })
      // Ticket
      .addCase(createTicket.pending, (state) => {
        state.admin.ticket.add.response.isLoading = true;
        state.admin.ticket.add.response.isSuccess = false;
        state.admin.ticket.add.response.toastMsg = "";
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.admin.ticket.add.response.isLoading = false;
        state.admin.ticket.add.response.isSuccess = true;
        state.admin.ticket.add.response.details = action.payload;
        state.admin.ticket.add.response.toastMsg = "User created successfully!";
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.admin.ticket.add.response.isLoading = false;
        state.admin.ticket.add.response.isSuccess = false;
        state.admin.ticket.add.response.toastMsg = "User creation failed.";
        state.admin.ticket.add.response.error = action.payload as string;
      })
      .addCase(retriveTicket.pending, (state) => {
        state.admin.ticket.view.response.isLoading = true;
        state.admin.ticket.view.response.error = null;
      })
      .addCase(retriveTicket.fulfilled, (state, action: PayloadAction<any>) => {
        state.admin.ticket.view.response.isLoading = false;
        state.admin.ticket.view.response.details = action.payload;
      })
      .addCase(retriveTicket.rejected, (state, action) => {
        state.admin.ticket.view.response.isLoading = false;
        state.admin.ticket.view.response.error = action.payload as string;
      })
      .addCase(updateTicket.pending, (state) => {
        state.admin.ticket.edit.response.isLoading = true;
        state.admin.ticket.edit.response.error = null;
        state.admin.ticket.add.response.toastMsg = "";
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.admin.ticket.edit.response.isLoading = false;
        state.admin.ticket.edit.response.isSuccess = true;
        state.admin.ticket.edit.response.details = action.payload;
        state.admin.ticket.add.response.toastMsg = "User updated successfully!";
        state.admin.ticket.edit.response.error = null;
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.admin.ticket.edit.response.isLoading = false;
        state.admin.ticket.edit.response.isSuccess = false;
        state.admin.ticket.edit.response.toastMsg = "User update failed.";
        state.admin.ticket.edit.response.error = action.payload as string;
      })

      // Reminder
      .addCase(createReminder.pending, (state) => {
        state.admin.reminder.add.response.isLoading = true;
        state.admin.reminder.add.response.isSuccess = false;
        state.admin.reminder.add.response.toastMsg = "";
      })
      .addCase(createReminder.fulfilled, (state, action) => {
        state.admin.reminder.add.response.isLoading = false;
        state.admin.reminder.add.response.isSuccess = true;
        state.admin.reminder.add.response.details = action.payload;
        state.admin.reminder.add.response.toastMsg =
          "User created successfully!";
      })
      .addCase(createReminder.rejected, (state, action) => {
        state.admin.reminder.add.response.isLoading = false;
        state.admin.reminder.add.response.isSuccess = false;
        state.admin.reminder.add.response.toastMsg = "User creation failed.";
        state.admin.reminder.add.response.error = action.payload as string;
      })
      .addCase(retriveReminder.pending, (state) => {
        state.admin.reminder.view.response.isLoading = true;
        state.admin.reminder.view.response.error = null;
      })
      .addCase(
        retriveReminder.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.admin.reminder.view.response.isLoading = false;
          state.admin.reminder.view.response.details = action.payload;
        }
      )
      .addCase(retriveReminder.rejected, (state, action) => {
        state.admin.reminder.view.response.isLoading = false;
        state.admin.reminder.view.response.error = action.payload as string;
      })
      .addCase(updateReminder.pending, (state) => {
        state.admin.reminder.edit.response.isLoading = true;
        state.admin.reminder.edit.response.error = null;
        state.admin.reminder.add.response.toastMsg = "";
      })
      .addCase(updateReminder.fulfilled, (state, action) => {
        state.admin.reminder.edit.response.isLoading = false;
        state.admin.reminder.edit.response.isSuccess = true;
        state.admin.reminder.edit.response.details = action.payload;
        state.admin.reminder.add.response.toastMsg =
          "User updated successfully!";
        state.admin.reminder.edit.response.error = null;
      })
      .addCase(updateReminder.rejected, (state, action) => {
        state.admin.reminder.edit.response.isLoading = false;
        state.admin.reminder.edit.response.isSuccess = false;
        state.admin.reminder.edit.response.toastMsg = "User update failed.";
        state.admin.reminder.edit.response.error = action.payload as string;
      })
      // Announcement
      .addCase(createAnnouncement.pending, (state) => {
        state.admin.announcement.add.response.isLoading = true;
        state.admin.announcement.add.response.isSuccess = false;
        state.admin.announcement.add.response.toastMsg = "";
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.admin.announcement.add.response.isLoading = false;
        state.admin.announcement.add.response.isSuccess = true;
        state.admin.announcement.add.response.details = action.payload;
        state.admin.announcement.add.response.toastMsg =
          "User created successfully!";
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.admin.announcement.add.response.isLoading = false;
        state.admin.announcement.add.response.isSuccess = false;
        state.admin.announcement.add.response.toastMsg =
          "User creation failed.";
        state.admin.announcement.add.response.error = action.payload as string;
      })
      .addCase(retriveAnnouncement.pending, (state) => {
        state.admin.announcement.view.response.isLoading = true;
        state.admin.announcement.view.response.error = null;
      })
      .addCase(
        retriveAnnouncement.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.admin.announcement.view.response.isLoading = false;
          state.admin.announcement.view.response.details = action.payload;
        }
      )
      .addCase(retriveAnnouncement.rejected, (state, action) => {
        state.admin.announcement.view.response.isLoading = false;
        state.admin.announcement.view.response.error = action.payload as string;
      })
      .addCase(updateAnnouncement.pending, (state) => {
        state.admin.announcement.edit.response.isLoading = true;
        state.admin.announcement.edit.response.error = null;
        state.admin.announcement.add.response.toastMsg = "";
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        state.admin.announcement.edit.response.isLoading = false;
        state.admin.announcement.edit.response.isSuccess = true;
        state.admin.announcement.edit.response.details = action.payload;
        state.admin.announcement.add.response.toastMsg =
          "User updated successfully!";
        state.admin.reminder.edit.response.error = null;
      })
      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.admin.announcement.edit.response.isLoading = false;
        state.admin.announcement.edit.response.isSuccess = false;
        state.admin.announcement.edit.response.toastMsg = "User update failed.";
        state.admin.announcement.edit.response.error = action.payload as string;
      });
  },
});

export const {
  setServiceView,
  setAddServiceFormTrue,
  setAppointmentView,
  setCustomerView,
  setAddCustomerFormTrue,
  setOpenSidebarTrue,
  setAddAppointmentFormTrue,
  resetUserState,
  setEditCustomerId,
  setEditCustomerFormTrue,
  setAddNotificationFormTrue,
  setAddSupportFormTrue,
  setAddBusinessFormTrue,
  setAddAvailabilityFormTrue,
  setEditAppointmentId,
  setEditAppointmentFormTrue,
  setEditServiceFormTrue,
  setEditServiceId,
  setAddFAQFormTrue,
  setEditFAQId,
  setEditFAQFormTrue,
  setAddTicketFormTrue,
  setEditTicketFormTrue,
  setAddBusinessDetailTrue,
  setAddStaffResourceTrue,
  setAddAdminResourceTrue,
  setEditStaffResourceTrue,
  setEditAdminResourceTrue,
  setEditStaffId,
  setEditTicketTrue,
  setEditTicketId,
} = adminSlice.actions;
export default adminSlice.reducer;
