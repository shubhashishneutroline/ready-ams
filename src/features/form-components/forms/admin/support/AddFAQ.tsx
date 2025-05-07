"use client";

import {
  addUserBtnProps,
  commonActions,
  fullNameProps,
} from "@/features/shared-features/form/formporps";

import { useForm } from "react-hook-form";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { motion, AnimatePresence } from "framer-motion";
import CenterSection from "@/features/shared-features/section/centersection";
import CloseIcon from "@mui/icons-material/Close";
import TextInput from "@/features/shared-features/form/inputtext";
import Button from "@/features/shared-features/common/button";
import { RootState, useAppDispatch, useAppSelector } from "@/state/store";
import { setAddFAQFormTrue } from "@/state/admin/AdminSlice";
import { useEffect, useRef } from "react";
import {
  formContainerCss,
  formOuterDivCss,
  formSmallContainerCss,
  formSubTitleCss,
  formSubmitDivCss,
  formTitleCss,
  formTitleDivCss,
} from "@/features/shared-features/form/props";
import { createFAQ, updateStaff } from "@/state/admin/AdminServices";
import SwitchInput from "@/features/shared-features/form/switchinput";
import SelectInput from "@/features/shared-features/form/selectinput";

const AddFAQ = () => {
  // On submit funciton
  const onSubmit = (data: any) => {
    const transformedData = {
      ...data,
      createdById: "cm9gu8ms60000vdg0zdnsxb6z",
      order: details?.length + 1,
      lastUpdatedById: "cm9gu8ms60000vdg0zdnsxb6z",
    };
    console.log(transformedData, "transformedData");
    dispatch(createFAQ(transformedData));
    reset();
    dispatch(setAddFAQFormTrue(false));
  };

  const dispatch = useAppDispatch();
  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.faq.add
  );
  const { details } = useAppSelector(
    (state: RootState) => state.admin.admin.faq.view.response
  );

  // React-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    trigger,
    control,
  } = useForm({});

  const form = {
    register,
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    watch,
    getValues,
    control,
    trigger,
  };

  const formRef = useRef<HTMLDivElement>(null);

  const remaining = { actions: commonActions, form, css: {} };

  const options = [
    { label: "General", value: "GENERAL" },
    { label: "Support", value: "SUPPORT" },

    { label: "Issues", value: "ISSUES" },
  ];

  const formObj = {
    question: {
      common: fullNameProps({
        input: "question",
        label: "Questions",
        placeholder: "Enter FAQ Question.",
        showImportant: true,
        type: "text",
      }),
      ...remaining,
    },
    answer: {
      common: fullNameProps({
        input: "answer",
        label: "Answer",
        placeholder: "Enter FAQ Answer.",
        showImportant: true,
        type: "textbox",
      }),
      ...remaining,
    },
    category: {
      common: fullNameProps({
        input: "category",
        label: "Category",
        placeholder: "Please Select a Category.",
        showImportant: true,
        type: "text",
      }),
      options,
      multiple: false,

      ...remaining,
    },
    isActive: {
      common: fullNameProps({
        input: "isActive",
        label: "Active ?",
        placeholder: "",
      }),
      ...remaining,
    },
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popup = document.querySelector(
        '.MuiPickersPopper-root, [role="dialog"]'
      );
      const clickedInsideCalendar =
        popup?.contains(event.target as Node) ?? false;
      const clickedInsideForm =
        formRef.current?.contains(event.target as Node) ?? false;

      if (!clickedInsideForm && !clickedInsideCalendar) {
        dispatch(setAddFAQFormTrue(false));
      }
    };
    if (isFlag) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFlag]);
  return (
    <AnimatePresence>
      {isFlag && (
        <CenterSection>
          <motion.div
            ref={formRef}
            initial={{ y: 50, scale: 0.9 }}
            animate={{ y: 0, scale: [0.9, 1.02, 1] }}
            exit={{ y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`${formSmallContainerCss} lg:h-[55%] `}
          >
            <div className={formTitleDivCss}>
              <div className={formTitleCss}>Add New FAQ</div>
              <div className={formSubTitleCss}>
                You’re creating an account on behalf of a user. Please ensure
                accuracy. ⚠️
              </div>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`${formOuterDivCss} overflow-y-auto gap-4`}
            >
              <div className="flex flex-col gap-4">
                <TextInput {...formObj.question} />
                <TextInput {...formObj.answer} />
                <SelectInput {...formObj.category} />
                <SwitchInput {...formObj.isActive} />
              </div>

              <div className=" flex flex-col mb-4  justify-center gap-4">
                <Button {...addUserBtnProps} />
              </div>
            </form>
          </motion.div>
        </CenterSection>
      )}
    </AnimatePresence>
  );
};

export default AddFAQ;
