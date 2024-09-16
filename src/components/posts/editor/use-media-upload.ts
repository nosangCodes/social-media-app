import { toast, useToast } from "@/components/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import React, { useState } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export default function useMediaUpload() {
  const {} = useToast();
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        const newName = `attachment_${crypto.randomUUID()}.${extension}`;
        return new File([file], newName, {
          type: file.type,
        });
      });
      
      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({
          file,
          isUploading: true,
        })),
      ]);
      
      console.log("🚀 ~ renamedFiles ~ renamedFiles:", renamedFiles)
      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadresult = res.find((r) => r.name === a.file.name);
          if (!uploadresult) return a;

          return {
            ...a,
            mediaId: uploadresult?.serverData?.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({
        variant: "destructive",
        description: e.message,
      });
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for current upload to finish.",
      });
      return;
    }

    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "You can only upload 5 attachments per post.",
      });
      return;
    }
    startUpload(files);
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    removeAttachment,
    reset,
    isUploading,
    uploadProgress,
  };
}
