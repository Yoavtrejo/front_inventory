'use client';

import { useRef, useState, type DragEvent } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';

interface FileDropzoneProps {
    file: File | null;
    onFileChange: (file: File | null) => void;
    accept?: string;
}

export function FileDropzone({ file, onFileChange, accept }: FileDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) onFileChange(droppedFile);
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(event) => { if (event.key === 'Enter') inputRef.current?.click(); }}
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            style={{
                border: `2px dashed ${isDragging ? 'var(--color-secondary)' : 'var(--color-primary)'}`, borderRadius: '12px', padding: '1.75rem 1rem',
                textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--surface-soft)' : 'transparent',
                fontFamily: 'Poppins', color: 'var(--text-muted)', transition: 'background 0.2s',
            }}
        >
            <IoCloudUploadOutline size={32} color="var(--color-primary)" />
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>
                {file ? <strong style={{ color: 'var(--color-secondary)' }}>{file.name}</strong> : 'Sube o arrastra el archivo aquí'}
            </p>
            {file && (
                <button
                    type="button"
                    onClick={(event) => { event.stopPropagation(); onFileChange(null); }}
                    style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'var(--color-secondary)', fontFamily: 'Poppins', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                    Quitar archivo
                </button>
            )}
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                hidden
                onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            />
        </div>
    );
}
