"use client";


import * as React from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { cn } from "@/lib/utils";


/**
 * Minimal shadcn-compatible form primitives
 * Usage:
 * <Form {...form}>
 *   <form>
 *     <FormField
 *       name="email"
 *       render={({ field }) => (
 *         <FormItem>
 *           <FormLabel>Email</FormLabel>
 *           <FormControl>
 *             <input id={useFormField().formItemId} {...field} />
 *           </FormControl>
 *           <FormDescription>We’ll never share it.</FormDescription>
 *           <FormMessage />
 *         </FormItem>
 *       )}
 *     />
 *   </form>
 * </Form>
 */


export const Form = FormProvider;


/* -------------------------------- context -------------------------------- */


type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = { name: TName };


const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null
);


/* ------------------------------- main hooks ------------------------------ */


export function useFormField() {
  const ctx = React.useContext(FormFieldContext);
  if (!ctx) {
    throw new Error("useFormField must be used within <FormField>");
  }
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(ctx.name, formState);
  const id = React.useId();
  return {
    name: ctx.name,
    id,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    fieldState,
  };
}


/* ---------------------- Controller inference workaround ------------------ */
/** Make Controller JSX-friendly with preserved generics */
const TypedController = Controller as unknown as <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: ControllerProps<TFieldValues, TName>
) => React.ReactElement;


/* --------------------------------- field --------------------------------- */


export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: ControllerProps<TFieldValues, TName>) {
  const { name, ...rest } = props;
  return (
    <FormFieldContext.Provider value={{ name } as FormFieldContextValue}>
      <TypedController name={name} {...rest} />
    </FormFieldContext.Provider>
  );
}


/* ------------------------------- primitives ------------------------------ */


export function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}


export function FormLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  // Associate the label with the input via htmlFor/aria-*
  const { formItemId } = useSafeFormIds();
  return (
    <label
      className={cn("text-sm font-medium", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}


export function FormControl({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // Wrapper around the control; shadcn uses Slot, a div works fine.
  return <div className={cn(className)} {...props} />;
}


export function FormMessage({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { fieldState, formMessageId } = useSafeFormIds();


  // react-hook-form error types can vary; pick message safely
  const rawMsg = (fieldState?.error as { message?: string })?.message;
  const body = typeof rawMsg === "string" ? rawMsg : null;


  if (!body && !children) return null;


  return (
    <p
      id={formMessageId}
      className={cn("text-xs text-red-600", className)}
      {...props}
    >
      {children ?? body}
    </p>
  );
}


export function FormDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { formDescriptionId } = useSafeFormIds();
  return (
    <p
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}


/* -------------------------------- helpers -------------------------------- */


/**
 * Graceful fallback if used outside <FormField> (prevents crashes).
 * Also exported so other modules can import if you split files later.
 */
export function useSafeFormIds() {
  try {
    return useFormField();
  } catch {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const id = React.useId();
    // Type-friendly fallback object that mimics useFormField() shape
    return {
      name: "" as FieldPath<FieldValues>,
      id,
      formItemId: `${id}-form-item`,
      formDescriptionId: `${id}-form-item-description`,
      formMessageId: `${id}-form-item-message`,
      fieldState: {
        invalid: false,
        isTouched: false,
        isDirty: false,
        error: undefined,
      } as ReturnType<ReturnType<typeof useFormContext>["getFieldState"]>,
    };
  }
}





