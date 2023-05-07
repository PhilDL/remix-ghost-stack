import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";

export type MarkdownEditorProps = {
  markdownContent: string;
  name: string;
  id?: string;
  className?: string;
  height?: string;
  theme?: "vs-dark" | "light";
};
export const MarkdownEditor = ({
  markdownContent,
  name,
  id,
  className,
  height = "90vh",
  theme = "vs-dark",
}: MarkdownEditorProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [content, setContent] = useState<string>(markdownContent);

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
  }

  function handleEditorChange(value: string | undefined) {
    setContent(value || "");
  }

  return (
    <>
      <textarea name={name} id={id ?? name} hidden value={content} readOnly />
      <Editor
        className={className}
        height={height ?? "90vh"}
        defaultLanguage="markdown"
        defaultValue={markdownContent}
        theme={theme}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
      />
    </>
  );
};
