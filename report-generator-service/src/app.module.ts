import { Module } from '@nestjs/common';
import { ReportModule } from './report/report.module';
import {PrismaService} from './prisma/prisma.service'

@Module({
  imports: [ReportModule],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class AppModule {}
