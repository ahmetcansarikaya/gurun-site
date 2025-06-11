import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya yüklenmedi' },
        { status: 400 }
      );
    }

    // Dosya tipini kontrol et
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Sadece görsel dosyaları yüklenebilir' },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Dosya boyutu 5MB\'dan küçük olmalıdır' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya adını oluştur
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
    const fileName = `${timestamp}-${originalName}`;

    // Uploads klasörünü oluştur
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await writeFile(path.join(uploadDir, fileName), buffer);

    return NextResponse.json({
      success: true,
      fileName: fileName,
      url: `/uploads/${fileName}`
    });
  } catch (error) {
    console.error('Dosya yüklenirken hata:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
} 