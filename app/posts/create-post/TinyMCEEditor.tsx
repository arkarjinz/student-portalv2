// components/TinyMCEEditor.tsx
'use client';
import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor: React.FC = () => {
    const [editorContent, setEditorContent] = useState('');

    const handleEditorChange = (content: string) => {
        setEditorContent(content);
    };

    return (
        <div>
            <Editor
                apiKey="yth5f7gfwmfj81tlozaxi4pefglr8wwyx9kyv8kdi9txpo18"
                value={editorContent}
                onEditorChange={handleEditorChange}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: ['link', 'lists', 'image', 'charmap'],
                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image',
                }}
            />

        </div>
    );
};

export default TinyMCEEditor;
