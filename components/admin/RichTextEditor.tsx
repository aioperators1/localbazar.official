"use client";

import React, { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
    value: string;
    onChange: (val: string) => void;
    dir?: "ltr" | "rtl";
}

export function RichTextEditor({ value, onChange, dir = "ltr" }: RichTextEditorProps) {
    const editorWrapperRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<any>(null);
    const isInternalChange = useRef(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!editorWrapperRef.current || quillRef.current) return;

        let active = true;

        const initQuill = async () => {
            try {
                const Quill = (await import("quill")).default;
                
                if (!active || quillRef.current) return;

                // Clear any existing toolbars or editors before re-init
                if (editorWrapperRef.current) {
                    editorWrapperRef.current.innerHTML = '<div class="ql-editor-container"></div>';
                }

                const editorContainer = editorWrapperRef.current?.querySelector('.ql-editor-container');
                if (!editorContainer) return;

                // Initialize Quill
                const quill = new Quill(editorContainer as HTMLElement, {
                    theme: "snow",
                    modules: {
                        toolbar: [
                            [{ 'header': [1, 2, 3, 4, false] }],
                            [{ 'font': [] }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] }],
                            ['link', 'image', 'video'],
                            ['clean']
                        ]
                    }
                });

                quillRef.current = quill;
                setIsReady(true);

                // Set initial value
                if (value) {
                    quill.clipboard.dangerouslyPasteHTML(value);
                }

                // Listen for changes
                quill.on("text-change", () => {
                    if (isInternalChange.current) return;
                    const html = quill.root.innerHTML;
                    if (html === '<p><br></p>') {
                        onChange("");
                    } else {
                        onChange(html);
                    }
                });
            } catch (error) {
                console.error("Quill initialization error:", error);
            }
        };

        initQuill();

        return () => {
            active = false;
        };
    }, []);

    // Update Quill if value changes from outside
    useEffect(() => {
        if (!quillRef.current || !isReady) return;
        
        const currentHtml = quillRef.current.root.innerHTML;
        // Basic normalization for comparison
        const normalizedValue = value || "";
        const normalizedCurrent = currentHtml === '<p><br></p>' ? '' : currentHtml;

        if (normalizedValue !== normalizedCurrent) {
            isInternalChange.current = true;
            const selection = quillRef.current.getSelection();
            quillRef.current.root.innerHTML = normalizedValue;
            if (selection) {
                quillRef.current.setSelection(selection);
            }
            isInternalChange.current = false;
        }
    }, [value, isReady]);

    return (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:border-gray-300" dir={dir}>
            <div ref={editorWrapperRef} className="quill-wrapper" />
            <style jsx global>{`
                .quill-wrapper .ql-toolbar {
                    border-top: none !important;
                    border-left: none !important;
                    border-right: none !important;
                    border-bottom: 1px solid #f3f4f6 !important;
                    background: #f9fafb;
                    padding: 0.75rem !important;
                    display: flex;
                    flex-wrap: wrap;
                }
                .quill-wrapper .ql-container {
                    border: none !important;
                    font-family: inherit;
                    font-size: 14px;
                    min-height: 250px;
                }
                .quill-wrapper .ql-editor {
                    min-height: 250px;
                    padding: 1.5rem;
                    line-height: 1.6;
                }
                .quill-wrapper .ql-editor.ql-blank::before {
                    color: #9ca3af;
                    font-style: normal;
                    left: 1.5rem;
                }
                .quill-wrapper .ql-editor img {
                    max-width: 100%;
                    border-radius: 0.75rem;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    margin: 1rem 0;
                }
                .quill-wrapper .ql-editor iframe {
                    max-width: 100%;
                    border-radius: 0.75rem;
                    aspect-ratio: 16/9;
                    margin: 1.5rem 0;
                }
                /* Professional Font Pickers */
                .ql-snow .ql-picker.ql-size .ql-picker-label::before,
                .ql-snow .ql-picker.ql-size .ql-picker-item::before {
                    content: 'Size' !important;
                }
                .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
                    content: 'Small' !important;
                }
                .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
                    content: 'Large' !important;
                }
                .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
                    content: 'Huge' !important;
                }
            `}</style>
        </div>
    );
}
