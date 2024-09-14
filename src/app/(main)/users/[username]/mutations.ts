import { useToast } from "@/components/hooks/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validations";
import { PostsPage } from "@/lib/types";

export function useUpdateUserProfileMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const router = useRouter();
  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        avatar && startAvatarUpload([avatar]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0]?.serverData?.avatarUrl;
      const queryFIlter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      queryClient.cancelQueries(queryFIlter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFIlter,
        (olddata) => {
          if (!olddata) return;
          return {
            pageParams: olddata.pageParams,
            pages: olddata.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.userId === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      router.refresh();
      toast({
        description: "Peofile updated.",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update profile. Please try again.",
      });
    },
  });

  return mutation;
}
