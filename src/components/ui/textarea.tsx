"use client";

import { useEffect, useState } from "react";
import styles from "./input.module.css";
import { Column } from "./flex";

type TextAreaProps = {
  label?: string;
  error?: string;
} & React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export default function TextArea({
  label,
  error,
  onChange,
  ...props
}: TextAreaProps) {
  const [errorInput, setErrorInput] = useState(false);

  useEffect(() => {
    setErrorInput(!!error);
  }, [error]);

  return (
    <Column
      className={`${styles.container} ${errorInput ? styles.error : ""}`}
      gap="xs"
    >
      {label && <label className={styles.label}>{label}</label>}

      <textarea
        onChange={(e) => {
          setErrorInput(false);

          if (onChange) {
            onChange(e);
          }
        }}
        {...props}
      />
      {errorInput && <p className={styles.errorMessage}>{error}</p>}
    </Column>
  );
}
