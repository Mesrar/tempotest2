"use client";

import { useToast as useToastUIComponent } from "@/components/ui/use-toast";

export const toast = (props: any) => {
  const { toast: toastFunction } = useToastUIComponent();
  return toastFunction(props);
};

export const useToast = useToastUIComponent;
