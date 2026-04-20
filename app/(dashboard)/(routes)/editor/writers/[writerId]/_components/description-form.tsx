"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Writer } from "@prisma/client";
import { cn } from "@/lib/utils";
import { StudioAIButton } from "@/components/studio-ai";


// ─── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

// ─── Props ────────────────────────────────────────────────────────────────────

interface DescriptionFormProps {
  initialData: Writer;
  writerId: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const DescriptionForm = ({
  initialData,
  writerId,
}: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: initialData.description ?? "" },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/writers/${writerId}`, values);
      toast.success("Beat updated.");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="mt-0 border border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2.5 h-2.5 border flex-shrink-0",
              initialData.description
                ? "bg-foreground border-foreground"
                : "border-muted-foreground",
            )}
          />
          <span className="font-mono text-[10px] tracking-widest uppercase text-foreground">
            Standfirst
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Studio AI button — always visible, not tied to edit mode */}
          <StudioAIButton
            variant="inline"
            options={{
              type: "description",
              prompt: `Write a compelling editorial standfirst (2–3 sentences) for a news beat titled "${initialData.title}". It should describe the beat's scope and editorial angle for readers.`,
            }}
          />
          <button
            onClick={() => setIsEditing((c) => !c)}
            className="flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase text-muted-foreground border border-border px-2.5 py-1 hover:border-foreground hover:text-foreground transition"
          >
            {isEditing ? (
              "✕ Cancel"
            ) : (
              <>
                <Pencil className="w-3 h-3" />
                {initialData.description ? "Edit" : "Add"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Display */}
      {!isEditing && (
        <div className="px-3.5 py-3">
          {initialData.description ? (
            <p className="font-serif text-sm italic text-foreground leading-relaxed">
              {initialData.description}
            </p>
          ) : (
            <p className="font-serif text-sm italic text-muted-foreground/50">
              — no standfirst yet
            </p>
          )}
        </div>
      )}

      {/* Edit form */}
      {isEditing && (
        <div className="px-3.5 py-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting}
                        placeholder="A compelling 2–3 sentence summary of what this beat covers…"
                        className="resize-none border-0 border-b border-foreground rounded-none bg-transparent font-serif italic text-sm placeholder:text-muted-foreground/40 focus-visible:ring-0 px-0 min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  size="sm"
                  className="font-mono text-[9px] uppercase tracking-wide rounded-none"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Studio AI block CTA — shown when field is empty and not editing */}
      {!isEditing && !initialData.description && (
        <StudioAIButton
          variant="block"
          className="border-t-0"
          options={{
            type: "description",
            prompt: `Write a compelling editorial standfirst (2–3 sentences) for a news beat titled "${initialData.title}". It should describe the beat's scope and editorial angle for readers.`,
          }}
        />
      )}
    </div>
  );
};
