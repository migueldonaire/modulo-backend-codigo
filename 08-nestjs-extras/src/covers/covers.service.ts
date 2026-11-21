import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// La extensión sale del tipo de archivo, nunca del nombre que manda el usuario
const EXTENSIONS: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
};

@Injectable()
export class CoversService {
  private readonly logger = new Logger(CoversService.name);

  // Un nombre nuevo y único: 3f2a...c1.png
  private newFileName(file: Express.Multer.File): string {
    return randomUUID() + EXTENSIONS[file.mimetype];
  }

  // Opción A: guardar la imagen en la carpeta uploads/ del servidor
  async saveLocal(file: Express.Multer.File): Promise<string> {
    const fileName = this.newFileName(file);
    await mkdir('uploads', { recursive: true }); // crea la carpeta si no existe
    await writeFile(join('uploads', fileName), file.buffer); // guarda los bytes
    return `/uploads/${fileName}`; // la dirección para verla
  }

  // Opción B: subir la imagen a Supabase Storage (el bucket "covers")
  async saveToSupabase(file: Express.Multer.File): Promise<string> {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) {
      throw new InternalServerErrorException('Falta configurar Supabase');
    }

    const supabase = createClient(url, key);
    const fileName = this.newFileName(file);

    const { error } = await supabase.storage
      .from('covers') // el bucket
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException('No se ha podido subir la imagen');
    }

    // La dirección pública de la imagen
    const { data } = supabase.storage.from('covers').getPublicUrl(fileName);
    return data.publicUrl;
  }
}
