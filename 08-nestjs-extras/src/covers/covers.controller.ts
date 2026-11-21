import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BooksService } from '../books/books.service';
import { CoversService } from './covers.service';

// Las reglas de la imagen: como mucho 2 MB y solo PNG, JPG o WEBP
const coverPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: 2 * 1024 * 1024, // 2 MB en bytes
      message: 'La imagen no puede pasar de 2 MB',
    }),
    new FileTypeValidator({ fileType: /^image\/(png|jpeg|webp)$/ }),
  ],
});

@Controller('books')
export class CoversController {
  constructor(
    private readonly coversService: CoversService,
    private readonly booksService: BooksService,
  ) {}

  // POST /api/v1/books/1/cover  → guarda la portada en uploads/
  @Post(':id/cover')
  @UseInterceptors(FileInterceptor('cover')) // el campo del formulario se llama "cover"
  async uploadLocal(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(coverPipe) file: Express.Multer.File,
  ) {
    await this.booksService.findOne(id); // 404 si el libro no existe
    const url = await this.coversService.saveLocal(file);
    return this.booksService.setCover(id, url);
  }

  // POST /api/v1/books/1/cover-supabase  → sube la portada a Supabase Storage
  @Post(':id/cover-supabase')
  @UseInterceptors(FileInterceptor('cover'))
  async uploadSupabase(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(coverPipe) file: Express.Multer.File,
  ) {
    await this.booksService.findOne(id);
    const url = await this.coversService.saveToSupabase(file);
    return this.booksService.setCover(id, url);
  }
}
