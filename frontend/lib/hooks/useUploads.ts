"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation } from "@tanstack/react-query";
import { api, unwrap } from "@/lib/api";

export function useUploadFile(endpoint = "/api/uploads/chat-attachment") {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append(endpoint.includes("brand-work") ? "files" : "file", file);
      return unwrap<any>(
        await api.post(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      );
    },
  });
}
