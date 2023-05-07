import { useEffect } from "react";

import { useToast } from "~/ui/hooks/use-toast";

export function useActionDataToast<
  T extends { errors: { message: string }[]; success: boolean } | undefined
>(data: T, options?: { successMessage?: string; errorMessage?: string }) {
  const { toast } = useToast();

  useEffect(() => {
    if (data?.errors.length) {
      toast({
        variant: "destructive",
        title: options?.errorMessage ?? "Uh oh! Something went wrong.",
        description: data?.errors[0].message,
      });
    }
    if (data?.success) {
      toast({
        description: options?.successMessage ?? "Record saved successfully.",
      });
    }
  }, [data, toast, options]);
}
