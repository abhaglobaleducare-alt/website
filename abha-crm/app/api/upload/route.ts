import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const bucket = String(formData.get('bucket') ?? 'attendance-selfies');

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: 'No file provided.' }, { status: 400 });
    }

    try {
      await supabaseAdmin.storage.createBucket(bucket, { public: true });
    } catch {
      // Bucket may already exist.
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, { contentType: file.type || 'image/png', upsert: true });

    if (error || !data) {
      throw error ?? new Error('Image upload failed.');
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path);

    return NextResponse.json({ ok: true, url: publicUrlData.publicUrl });
  } catch (error) {
    console.error('Upload failed', error);
    return NextResponse.json({ ok: false, error: 'Unable to upload file.' }, { status: 500 });
  }
}
