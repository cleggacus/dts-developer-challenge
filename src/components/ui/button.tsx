import styles from "./button.module.css";

type ButtonProps = {
  flex?: number,
  variant?: "1" | "2" | "error"
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export default function Button({ children, flex, style = {}, variant = "1", className = "", ...props }: ButtonProps) {
  return <button
    style={{ ...style, flex }}
    className={`${styles.container} ${styles[`variant-${variant}`]} ${className}`}
    {...props}
  >
    {children}
  </button>
}
