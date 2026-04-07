import { useState } from "react";
import type { Field } from "./FieldValidation";



export function useField(validator: (v: string) => boolean) {
  const [field, setField] = useState<Field>({ value: "", valid: false, touched: false });
  const onChange = (v: string) =>
    setField({ value: v, valid: validator(v), touched: v.length > 0 });
  return { field, onChange };
}