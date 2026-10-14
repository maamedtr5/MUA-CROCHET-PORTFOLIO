import { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { ImageBucket } from '@/lib/storage';

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
  bucket: ImageBucket;
}

// A plain native <input type="file" multiple accept="image/*"> — deliberately
// not a drag-and-drop-only widget, since on a phone that input already opens
// the native picker with a "Photo Library / Camera" choice. No max count or
// file-size cap, per the SRS.
export default function ImageUploader({ images, onChange, bucket }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        // Strip anything Storage dislikes from phone-camera file names
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, { contentType: file.type, cacheControl: '31536000' });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? `Upload failed: ${err.message}` : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
      // Keep whatever did upload, even if a later file in the batch failed
      if (uploaded.length > 0) onChange([...images, ...uploaded]);
    }
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: '1.5px dashed var(--line)', borderRadius: 8, padding: 28,
          textAlign: 'center', color: 'var(--bark-soft)', fontSize: '0.88rem', cursor: 'pointer',
        }}
      >
        {uploading ? 'Uploading…' : 'Tap to choose photos — no limit on count or size'}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p style={{ color: 'var(--rust-bold)', fontSize: '0.85rem', margin: '10px 0 0' }}>{error}</p>}

      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 10, marginTop: 14 }}>
          {images.map((src, i) => (
            <div key={src} style={{ position: 'relative', aspectRatio: '1/1' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
              <button
                type="button"
                onClick={() => removeAt(i)}
                style={{
                  position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%',
                  border: 'none', background: 'rgba(20,15,10,0.7)', color: '#fff', cursor: 'pointer', fontSize: '0.7rem',
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
