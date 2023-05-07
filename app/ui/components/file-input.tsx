"use client";

import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { cn } from "../utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";
import { Label } from "./label";
import { Image, Replace, Trash } from "lucide-react";

interface FileInputProps {
  onChange?: (file: File | undefined) => any;
  imageUrl?: string;
  inputName: string;
  acceptedContentTypes: string[];
  className?: string;
}

export type FileInputHandle = {
  reset: () => void;
};

export const FileInput = React.forwardRef<FileInputHandle, FileInputProps>(
  ({ onChange, imageUrl, inputName, acceptedContentTypes, className }, ref) => {
    const [draggingOver, setDraggingOver] = useState(false);
    const [isFocused, setisFocused] = useState(false);
    const [deleteIntent, setDeleteIntent] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [preview, setPreview] = useState<string | undefined>(
      imageUrl || undefined
    );
    const dropRef = useRef(null);

    useImperativeHandle(ref, () => ({
      reset() {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
          fileInputRef.current.files = null;
        }
        selectedFile && setSelectedFile(undefined);
        if (preview) {
          URL.revokeObjectURL(preview);
          setPreview(undefined);
        }
      },
    }));

    useEffect(() => {
      if (!selectedFile) {
        return;
      }
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      setDeleteIntent(false);
      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const preventDefaults = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      preventDefaults(e);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onChange && onChange(e.dataTransfer.files[0]);
        setSelectedFile(e.dataTransfer.files[0]);
        if (fileInputRef.current) {
          fileInputRef.current.files = e.dataTransfer.files;
        }
        e.dataTransfer.clearData();
      }
      setDraggingOver(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.files && event.currentTarget.files[0]) {
        onChange && onChange(event.currentTarget.files[0]);
        setSelectedFile(event.currentTarget.files[0]);
      }
    };

    const onDeleteImage = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedFile(undefined);
      onChange && onChange(undefined);
      setPreview(undefined);
      setDeleteIntent(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const showPreview = preview !== undefined && preview !== "";

    return (
      <ContextMenu>
        <ContextMenuTrigger disabled={!preview} asChild>
          <Label
            className={cn(
              "group h-32 flex w-full cursor-pointer flex-col justify-center space-y-1 rounded-md border-2 border-dashed border-input text-center focus:border-muted-foreground",
              draggingOver || isFocused
                ? "border-muted-foreground"
                : "border-input hover:border-muted-foreground",
              showPreview && "bg-center bg-cover bg-no-repeat",
              className
            )}
            style={{
              backgroundImage: showPreview ? `url('${preview}')` : undefined,
            }}
            htmlFor={inputName}
            ref={dropRef}
            onDragEnter={() => setDraggingOver(true)}
            onDragLeave={() => setDraggingOver(false)}
            onDrag={preventDefaults}
            onDragStart={preventDefaults}
            onDragEnd={preventDefaults}
            onDragOver={preventDefaults}
            onDrop={handleDrop}
          >
            <div
              className={cn(
                "p-6 w-full h-full flex-col flex justify-center items-center gap-2",
                showPreview &&
                  "group-hover:backdrop-blur-xs group-hover:bg-slate-950/70"
              )}
            >
              {deleteIntent && (
                <input
                  type="hidden"
                  name={`${inputName}Delete`}
                  value={"true"}
                />
              )}
              <input
                id={inputName}
                name={inputName}
                type="file"
                className="sr-only"
                onChange={handleChange}
                multiple={false}
                ref={fileInputRef}
                onBlur={(e) => {
                  setisFocused(false);
                }}
                onFocus={(e) => {
                  setisFocused(true);
                }}
                accept={acceptedContentTypes.join(", ")}
              />

              {showPreview ? (
                <div className="hidden text-xs italic text-slate-400 group-hover:flex group-hover:h-full group-hover:flex-col group-hover:items-center group-hover:justify-center">
                  Right click
                </div>
              ) : (
                <>
                  <Image className="mx-auto h-12 w-12 text-input group-hover:text-muted-foreground" />
                  <p className="text-xs text-input group-hover:text-muted-foreground">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </>
              )}
            </div>
          </Label>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem asChild>
            <button
              className="flex w-full items-center"
              onClick={onDeleteImage}
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </button>
          </ContextMenuItem>
          <ContextMenuItem onClick={(e) => fileInputRef.current?.click()}>
            <Replace className="mr-2 h-4 w-4" /> Replace
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }
);

FileInput.displayName = "FileInput";
