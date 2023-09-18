import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

type InputProps = {} & TextFieldProps;

const Input = (props: InputProps) => {
  return <TextField {...props} />;
};

export { Input };
