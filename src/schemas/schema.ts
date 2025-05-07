/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  TitleSchema,
  HandleActionSchema,
  HrefSchema,
  FlagSchema,
  IconSchema,
  ChildrenSchema,
  LabelSchema,
  ColorSchema,
  SrcSchema,
  OptionSchema,
  OtherChildrenSchema,
  ButtonNameSchema,
} from "./GlobalSchema";

export type FormSchema = {
  form: {
    register: any;
    errors: any;

    setValue?: any;
    reset?: any;
    control?: any;
    handleSubmit?: any;
    onSubmit?: any;
    trigger?: any;
  };
};

export type FormActionsSchema = {
  actions?: {
    handleClick?: any;
    handleKeyUp?: any;
    handleKeyDown?: any;
    handleOnChange?: any;
  };
};

export type CommonInputSchema = {
  common: {
    input: string;
    label?: string;
    type?: string;
    defaultValue?: any;
    placeholder?: string;
    showForgotPassword?: boolean;
    showImportant?: boolean;
    icon?: any;
    restCommon?: any;
    handleOnChange?: any;
    ref?: any;
    leftLabel?: string;
    rightLabel?: string;
    disabledValues?: any;
    format?: string;
  };
};

type inputPropsSchema = { inputProps?: any };
type inputRefSchema = { inputRef?: any };

export type ErrorMsgSchema = { errorMsg?: string };

export interface InputSchema
  extends CssSchema,
    inputRefSchema,
    inputPropsSchema,
    ErrorMsgSchema,
    FormSchema,
    CommonInputSchema {}
export interface SwitchInputSchema
  extends CssSchema,
    inputRefSchema,
    inputPropsSchema,
    ErrorMsgSchema,
    CommonInputSchema {}

export type CssSchema = {
  css: {
    customCss?: string;
    divCss?: string;
    labelCss?: string;
    iconCss?: string;
    inputCss?: string;
    errorCss?: string;
    colorCss?: string;
    imgCss?: string;
  };
};

// buttons
export interface ButtonSchema
  extends TitleSchema,
    HandleActionSchema,
    CssSchema,
    HrefSchema,
    FlagSchema,
    IconSchema {}

//  disconut cards
export interface DiscountCardSchema
  extends ChildrenSchema,
    CssSchema,
    TitleSchema,
    IconSchema,
    LabelSchema,
    ColorSchema {}

// cards

// images
export interface CustomImageProps extends SrcSchema, CssSchema {
  alt: string;
}

// forms

export interface InputSchema
  extends CssSchema,
    ErrorMsgSchema,
    FormSchema,
    FormActionsSchema,
    CommonInputSchema {}

export interface SelectInputSchema extends InputSchema {
  options: OptionSchema[];
  multiple: boolean;
}

export interface AuthFormContainerSchema
  extends ChildrenSchema,
    OtherChildrenSchema,
    HandleActionSchema,
    TitleSchema,
    SrcSchema,
    ButtonNameSchema,
    FlagSchema {}
