import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './modules/common/common.module';
import { CacheModule } from './modules/cache/cache.module';
import { NotebookModule } from './modules/notebook/notebook.module';
import { UserModule } from './modules/user/user.module';
import { NoteModule } from './modules/note/note.module';
import { TagModule } from './modules/tag/tag.module';
import { NoteToNotebookModule } from './modules/note-to-notebook/note-to-notebook.module';
import { AppConfigModule } from './modules/app-config/app-config.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    CommonModule,
    CacheModule,
    NotebookModule,
    UserModule,
    NoteModule,
    NoteToNotebookModule,
    TagModule,
    AppConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
