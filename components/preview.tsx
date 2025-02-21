"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";

interface previewProps {
  value: string;
}
export const Preview = ({ value }: previewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );
  return <ReactQuill theme="bubble" value={value} readOnly />;
};


