import { supabase } from '@/lib/supabase';

export type ImageBucket = 'makeup-images' | 'crochet-images' | 'site-images';

// Public URLs look like  <project>/storage/v1/object/public/<bucket>/<path>
// Pull bucket + path back out so removed images can be deleted from Storage.
function parsePublicUrl(url: string): { bucket: string; path: string } | null {
  const marker = '/storage/v1/object/public/';
  const i = url.indexOf(marker);
  if (i === -1) return null;
  const [bucket, ...rest] = url.slice(i + marker.length).split('/');
  if (!bucket || rest.length === 0) return null;
  return { bucket, path: decodeURIComponent(rest.join('/')) };
}

export async function deleteStoredImages(urls: string[]): Promise<void> {
  const byBucket = new Map<string, string[]>();
  for (const url of urls) {
    const parsed = parsePublicUrl(url);
    if (!parsed) continue;
    byBucket.set(parsed.bucket, [...(byBucket.get(parsed.bucket) ?? []), parsed.path]);
  }
  for (const [bucket, paths] of byBucket) {
    // Best effort: a failed cleanup must never block deleting the post itself.
    await supabase.storage.from(bucket).remove(paths).catch(() => {});
  }
}
