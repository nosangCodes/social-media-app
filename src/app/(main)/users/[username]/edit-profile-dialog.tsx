import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserData } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateUserProfileMutation } from "./mutations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import { Label } from "@/components/ui/label";
import avatarUrlPlaceholder from "@/assets/avatar-placeholder.png";
import { Camera } from "lucide-react";
import CropImageDialog from "@/components/crop-image-dialog";
import Resizer from "react-image-file-resizer";

type Props = {
  user: UserData;
  open: boolean;
  onClose: (open: boolean) => void;
};

export default function EditProfileDialog({ open, onClose, user }: Props) {
  const form = useForm({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });

  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  const mutation = useUpdateUserProfileMutation();
  const onSubmit = (values: UpdateUserProfileValues) => {
    const newAvatarUrl = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`)
      : undefined;

    mutation.mutate(
      {
        values,
        avatar: newAvatarUrl,
      },
      {
        onSuccess: () => {
          setCroppedAvatar(null);
          onClose(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div>
          <Label>Avatar</Label>
          <AvatarInput
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : user.avatarUrl || avatarUrlPlaceholder
            }
            onImageCropped={setCroppedAvatar}
          />
        </div>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Tell us a little about yourself"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={mutation.isPending}>Update</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}

function AvatarInput({ onImageCropped, src }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileSelect = (file?: File | null) => {
    if (!file) return;

    Resizer.imageFileResizer(
      file,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  };
  return (
    <>
      <input
        className="sr-only hidden"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => onFileSelect(e.target.files?.[0])}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        type="button"
        className="group relative block"
      >
        <Image
          className="size-32 flex-none rounded-full object-cover"
          src={src}
          alt="Avatar preview"
          height={150}
          width={150}
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center divide-gray-200 rounded-full bg-black bg-opacity-30 text-white transition-opacity group-hover:bg-opacity-25">
          <Camera size={24} />
        </span>
      </button>

      {imageToCrop && (
        <CropImageDialog
          onCropped={onImageCropped}
          src={URL.createObjectURL(imageToCrop)}
          cropAspecttRatio={1}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}
