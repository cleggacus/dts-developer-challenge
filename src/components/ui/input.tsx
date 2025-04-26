"use client";

import { useEffect, useState } from "react";
import styles from "./input.module.css";
import { Column } from "./flex";

type InputProps = {
  label?: string,
  error?: string,
  grow?: boolean,
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export default function Input({ label, error, onChange, grow, ...props }: InputProps) {
  const [errorInput, setErrorInput] = useState(false);

  useEffect(() => {
    if (error) {
      setErrorInput(true);
    }
  }, [error])

  return <Column
    className={`${styles.container} ${errorInput ? styles.error : ""} ${grow ? styles.grow : ""}`}
    gap="xs"
  >
    {label && <label className={styles.label}>{label}</label>}

    <input
      onChange={e => {
        setErrorInput(false);

        if (onChange) {
          onChange(e);
        }
      }}
      {...props}
    />
    {error && <p className={styles.errorMessage}>{error}</p>}

  </Column>
}
