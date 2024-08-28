import { Body, Controller, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService){}

    @Post()
    async createReport(@Body(new ValidationPipe({
        whitelist: true
    })) createReportDto: CreateReportDto){
        const reportId = await this.reportService.createReport(createReportDto)
        return reportId
    }

    @Get()
    async getAllReports() {
        const reports = await this.reportService.getAllReports()
        return reports;
    }

    @Get(':id')
    async getReportStatus(@Param('id') id: string) {
        const status = await this.reportService.getReportStatus(id)
        return status;
    }
}
