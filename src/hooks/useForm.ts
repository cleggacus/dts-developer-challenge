import { useState } from "react";
import { z } from "zod";

export type ZodFormSchema =
  | z.ZodObject<z.ZodRawShape>
  | z.ZodEffects<z.ZodObject<z.ZodRawShape>>
  | z.ZodEffects<z.ZodEffects<z.ZodObject<z.ZodRawShape>>>;

export type ErrorMap<T extends ZodFormSchema> = {
  [K in keyof z.input<T>]?: string[] | undefined;
} & {
  root?: string[] | undefined;
};

export type FormArg<T extends ZodFormSchema> = {
  schema: T;
  default: Partial<z.input<T>>;
};

function getShape(schema: ZodFormSchema) {
  while (schema instanceof z.ZodEffects) {
    schema = schema._def.schema;
  }

  return schema.shape;
}

function getInitVals<T extends ZodFormSchema>(formArg: FormArg<T>) {
  return {
    ...Object.keys(getShape(formArg.schema)).reduce((acc, key) => {
      acc[key as keyof z.input<T>] = "" as z.input<T>[typeof key];
      return acc;
    }, {} as z.input<T>),
    ...formArg.default,
  };
}

export function useForm<T extends ZodFormSchema>(formArg: FormArg<T>) {
  const [values, setValues] = useState<z.input<T>>(getInitVals(formArg));
  const [errors, setErrors] = useState<ErrorMap<T>>({});

  function register(key: keyof z.input<T>) {
    return {
      value: values[key],
      error: errors[key] ? errors[key][0] : undefined,
      name: key,
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        setValues((values) => ({
          ...values,
          [key]: e.target.value,
        }));
      },
    };
  }

  function handleSubmit(onValid: (values: z.infer<T>) => void) {
    return async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const result = formArg.schema.safeParse(values);

      if (result.success) {
        setErrors({});
        onValid(result.data);
      } else {
        setErrors(result.error.flatten().fieldErrors);
      }
    };
  }
  return {
    register,
    errors,
    setErrors,
    values,
    setValues,
    handleSubmit,
  };
}
