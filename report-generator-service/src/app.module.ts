import { Module } from '@nestjs/common';
import { ReportModule } from './report/report.module';
import {PrismaService} from './prisma.service'

@Module({
  imports: [
    ReportModule
    
  ],
  controllers: [ ],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class AppModule {}
