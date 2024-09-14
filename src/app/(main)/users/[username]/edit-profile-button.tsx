"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import EditProfileDialog from "./edit-profile-dialog";
import { UserData } from "@/lib/types";
type Props = {
  user: UserData;
};

export default function EditProfileButton({ user }: Props) {
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  return (
    <>
      <Button
        variant={"outline"}
        onClick={() => setShowEditProfileDialog(true)}
      >
        Edit profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showEditProfileDialog}
        onClose={() => setShowEditProfileDialog(false)}
      />
    </>
  );
}
