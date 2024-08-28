import { Body, Controller, Get, HttpStatus, Param, Post, Res, ValidationPipe } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';
import { Response } from 'express';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService){}

    // Создание отчета
    @Post()
    async createReport(@Body(new ValidationPipe({
        whitelist: true
    })) createReportDto: CreateReportDto){
        const reportId = await this.reportService.createReport(createReportDto)
        return reportId
    }

    // Проверка готовности отчета
    @Get(':id')
    async getReportStatus(@Param('id') id: string) {
        const status = await this.reportService.getReportStatus(id)
        return status;
    }

    // Скачивание отчета
    @Get(':id/download')
    async downloadReport(@Param('id') id: string, @Res()res: Response) {
        const filePath = await this.reportService.downloadReport(id)
        res.setHeader('Content-Disposition', `attachment; filename=report-${id}.xlsx`);
        res.sendFile(filePath);
    }
}
