"use client";

import { useEffect, useState } from "react";
import styles from "./select.module.css";
import { Column } from "./flex";

type SelectProps = {
  label?: string;
  error?: string;
} & React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

export default function Select({ label, className = "", error, onChange, children, ...props }: SelectProps) {
  const [errorState, setErrorState] = useState(false);

  useEffect(() => {
    setErrorState(!!error);
  }, [error]);

  return (
    <Column
      className={`${styles.container} ${errorState ? styles.error : ""} ${className}`}
      gap="xs"
    >
      {label && <label className={styles.label}>{label}</label>}

      <select
        onChange={(e) => {
          setErrorState(false);
          if (onChange) {
            onChange(e);
          }
        }}
        className={styles.select}
        {...props}
      >
        {children}
      </select>

      {errorState && <p className={styles.errorMessage}>{error}</p>}
    </Column>
  );
}
