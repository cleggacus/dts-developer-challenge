import styles from "./card.module.css";

export type CardProps = {
  padding?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl",
  variant?: "1" | "2"
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export default function Card({ padding = "lg", style = {}, className = "", variant = "1", ...props }: CardProps) {
  return <div
    className={`${styles.container} ${styles[`variant-${variant}`]} ${className}`}
    style={{ ...style, padding: `var(--spacing-${padding})` }}
    {...props}
  />
}
