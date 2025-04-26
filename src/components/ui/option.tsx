"use client";

type OptionProps = React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;

export default function Option(props: OptionProps) {
  return <option {...props}>{props.children}</option>;
}
