"use client";

import { FAQ } from "@/features/faq/types/types";
import Button from "@/features/shared-features/common/button";
import {
  addAppointmentBtnProps,
  addFAQBtnProps,
} from "@/features/shared-features/form/formporps";
import { formOuterDivCss } from "@/features/shared-features/form/props";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TagIcon from "@mui/icons-material/Tag";
import QuizIcon from "@mui/icons-material/Quiz";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import React, { useEffect, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/state/store";
import {
  setAddFAQFormTrue,
  setEditFAQFormTrue,
  setEditFAQId,
} from "@/state/admin/AdminSlice";
import { deleteFAQ, retriveFAQ } from "@/state/admin/AdminServices";

// export const dummyFAQs: FAQ[] = [
//   {
//     id: "1",
//     question: "How can I reset my password?",
//     answer:
//       "You can reset your password by clicking on the 'Forgot Password' link on the login page and following the instructions.",
//     category: "General",
//     isActive: true,
//     order: 1,
//     lastUpdatedById: "user123",
//     createdById: "admin1",
//   },
//   {
//     id: "2",
//     question: "How do I contact customer support?",
//     answer:
//       "You can reach our customer support team by emailing support@ourcompany.com or calling (123) 456-7890.",
//     category: "Support",
//     isActive: true,
//     order: 2,
//     lastUpdatedById: "user124",
//     createdById: "admin2",
//   },
//   {
//     id: "3",
//     question: "What payment methods are accepted?",
//     answer: "We accept credit/debit cards, PayPal, and bank transfers.",
//     category: "Billing",
//     isActive: true,
//     order: 3,
//     lastUpdatedById: "user125",
//     createdById: "admin3",
//   },
//   {
//     id: "4",
//     question: "Where can I view my order history?",
//     answer:
//       "You can view your order history by logging into your account and navigating to the 'Orders' section.",
//     category: "General",
//     isActive: false, // Inactive FAQ
//     order: 4,
//     lastUpdatedById: "user126",
//     createdById: "admin4",
//   },
// ];

const FAQPage = () => {
  const dispatch = useAppDispatch();
  const [order, setOrder] = useState(1);
  const { details: dummyFAQs } = useAppSelector(
    (state: RootState) => state.admin.admin.faq.view.response
  );
  const openAddFAQForm = () => {
    dispatch(setAddFAQFormTrue(true));
  };

  console.log(dummyFAQs, "Dummy Faq");

  useEffect(() => {
    dispatch(retriveFAQ());
  }, [dispatch]);

  return (
    <div className={`${formOuterDivCss}  gap-8 lg:w-[880px]`}>
      <div className="flex w-full flex-col gap-3">
        {" "}
        <div className="flex justify-between items-center">
          <div className="flex flex-col jutify-start px-2  gap-2   ">
            <h1 className="text-black font-semibold text-[18px]">
              What to Include?
            </h1>
            <p className="italic text-[12px] sm:text-[14px] text-slate-600">
              Following queries will de displayed to users in FAQ section.
            </p>
          </div>
          <Button {...addFAQBtnProps(openAddFAQForm)} />
        </div>
        <div className="flex flex-col jutify-start px-2  "></div>
      </div>
      <div className="w-full max-h-[100%-40px] overflow-y-auto scrollbar flex flex-col gap-8 px-3">
        {dummyFAQs?.map((faqs: FAQ, index: number) => (
          <div key={index} className="w-full flex flex-col gap-2">
            <div className="flex justify-between w-full pr-4">
              <div className="flex gap-2 text-[15px] font-[500] leading-[100%] traccking-[-1%] items-center">
                <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-sm border-[1px] border-gray-200 flex items-center justify-center">
                  <TagIcon
                    className="text-gray-600"
                    sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" } }}
                  />
                </div>
                <div className="text-[13px] sm:text-[16px] font-[500]">
                  FAQ{index + 1}
                </div>
              </div>
              <div className="flex gap-6">
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={() => {
                    dispatch(setEditFAQId(faqs.id));
                    dispatch(setEditFAQFormTrue(true));
                    setOrder(index);
                  }}
                >
                  <div className="text-[13px] sm:text-[16px] font-[500]">
                    Edit
                  </div>
                  <DriveFileRenameOutlineIcon
                    className="text-green-500"
                    sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" } }}
                  />
                </div>
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={() => {
                    dispatch(deleteFAQ(faqs));
                    setOrder(index);
                  }}
                >
                  <div className="text-[13px] sm:text-[16px] font-[500]">
                    Delete
                  </div>
                  <DeleteSweepOutlinedIcon
                    className="text-red-500"
                    sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" } }}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 text-[15px] font-[400] leading-[100%] traccking-[-1%] items-center text-black">
              <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-sm border-[1px] border-gray-200 flex items-center justify-center">
                <QuizIcon
                  className="text-gray-500"
                  sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" } }}
                />
              </div>
              <div className="text-[13px] sm:text-[16px] font-[400]">
                {faqs.question}
              </div>
            </div>
            <div className="flex-1 w-full justify-start">
              <div className="min-h-[50px] bg-gray-200/40 border-gray-300 border-[1px] px-1 py-1.5 sm:py-3 flex gap-1 items-center  rounded-md">
                <div>
                  <KeyboardArrowRightIcon
                    className="text-gray-500"
                    sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" } }}
                  />
                </div>
                <div className="text-[12px] sm:text-[14px] italic text-gray-700">
                  {faqs.answer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
