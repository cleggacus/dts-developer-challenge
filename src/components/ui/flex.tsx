import styles from "./flex.module.css";

export type FlexProps = {
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl",
  direction?: "row" | "column"
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export default function Flex({ gap = "md", direction = "row", style = {}, className = "", ...props }: FlexProps) {
  return <div
    className={`${styles.container} ${styles[direction]} ${className}`}
    style={{ ...style, gap: gap == "none" ? undefined : `var(--spacing-${gap})` }}
    {...props}
  />
}

export type RowProps = Omit<FlexProps, "direction">;

export function Row(props: RowProps) {
  return <Flex {...props} direction="row" />
}

export type ColumnProps = Omit<FlexProps, "direction">;

export function Column(props: ColumnProps) {
  return <Flex {...props} direction="column" />
}
