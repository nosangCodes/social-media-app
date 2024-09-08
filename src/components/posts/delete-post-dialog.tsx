"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { PostData } from "@/lib/types";
import { useDeletePostMutation } from "./mutations";
import { Button } from "../ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  post: PostData;
};

export default function DeletePostDialog({ open, onClose, post }: Props) {
  const mutation = useDeletePostMutation();

  const handleClose = () => {
    if (!open || !mutation.isPending) {
      onClose;
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() =>
              mutation.mutate(post.id, {
                onSuccess: onClose,
              })
            }
            variant={"destructive"}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
          <Button
            disabled={mutation.isPending}
            variant={"outline"}
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
