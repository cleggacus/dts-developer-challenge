import styles from "./dialog.module.css";
import Card, { CardProps } from "./card";

type DialogProps = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & CardProps;

export default function Dialog({ open, setOpen, ...props }: DialogProps) {
  return open ? <div
    className={styles.container}
  >
    <div
      className={styles.bg}
      data-testid="dialog-bg"
      onClick={e => {
        setOpen(false);
        e.stopPropagation();
      }}
    ></div>
    <Card {...props} />
  </div> : <></>
}
