"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ArticleActionsProps {
  disabled: boolean;
  writerId: string;
  articleId: string;
  isPublished: boolean;
}

export const ArticleActions = ({
  disabled,
  writerId,
  articleId,
  isPublished,
}: ArticleActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(
          `/api/writers/${writerId}/articles/${articleId}/unpublish`
        );
        toast.success("Article unpublished");
      } else {
        await axios.patch(
          `/api/writers/${writerId}/articles/${articleId}/publish`
        );
        toast.success("Article published");
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/writers/${writerId}/articles/${articleId}`);
      toast.success("Article deleted");
      router.refresh();
      router.push(`/editor/editor/writers/${writerId}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
