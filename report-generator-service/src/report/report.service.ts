import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';

@Injectable()
export class ReportService {
    constructor(
        private prisma: PrismaService,
    ) {
      
    }
    private chunk_size= 15;

    async createReport(createReportDto: CreateReportDto) {
        try {
            const reportId = uuidv4();
            await this.prisma.report.create({
                data: {
                    id: reportId,
                    requesterServiceName: createReportDto.requesterServiceName,
                    endpoint: createReportDto.endpoint,
                    headers: createReportDto.headers,
                    status: 'in_process'
                }
            });

            // Запуск обработки отчета
            this.processReport(reportId, createReportDto);

            return reportId;
        } catch (error) {
            throw new HttpException(`Failed to create report: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllReports() {
        try {
            const reports = await this.prisma.report.findMany();
            if (!reports || reports.length === 0) {
                throw new NotFoundException('Reports not found');
            }
            return reports;
        } catch (error) {
            throw new HttpException(`Failed to retrieve reports: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getReportStatus(id: string) {
        try {
            const report = await this.prisma.report.findUnique({
                where: { id }
            });

            if (!report) {
                throw new NotFoundException(`Report with ID ${id} not found`);
            }

            return {
                status: report.status,
                url: report.status === 'completed' ? `http://localhost:3000/reports/${id}/download` : null,
            };
        } catch (error) {
            throw new HttpException(`Failed to get report status: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async fetchDataFromRequester(endpoint: string, headers: string[], page: number) {
        
        let paramHeaderStr = '';
        if (headers.length) {
            paramHeaderStr = '&headers=' + headers.join(',');
        }
        const response = await axios.get(`${endpoint}?page=${page}&size=${this.chunk_size}${paramHeaderStr}`);
        return response.data;
    }

    private async processReport(reportId: string, createReportDto: CreateReportDto) {
        try {
            const { endpoint, headers } = createReportDto;
            let page = 1;
            let hasMoreData = true;
            let filePath = path.join(__dirname, '..', 'reports', `report-${reportId}.xlsx`);
            let reportData: any[] = [];

            if (!fs.existsSync(path.dirname(filePath))) {
                fs.mkdirSync(path.dirname(filePath), { recursive: true });
            }

            while(hasMoreData){
                const data = await this.fetchDataFromRequester(endpoint, headers, page);
                console.log(data)
                if(data.length===0){
                    hasMoreData=false;
                }
                else{
                    // Преобразуем данные в формат, подходящий для Excel
                    const chunkData = data.map((item: any) => {
                        const result: any = {};
                        headers.forEach((header: string) => result[header] = item[header]);
                        return result;
                    });

                    reportData = reportData.concat(chunkData);

                    // Обновляем или создаем Excel-файл с новыми данными
                    const ws = XLSX.utils.json_to_sheet(reportData);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'Report');
                    XLSX.writeFile(wb, filePath);
                    
                    page++;
                }
            }
            // while (hasMoreData) {
            //     const data = await this.fetchDataFromRequester(endpoint, headers, page);

            //     if (data.length < 5) { // предположим, что размер страницы = 5
            //         hasMoreData = false;
            //     }

            //     reportData = reportData.concat(data);
            //     page++;
            // }

          


            await this.prisma.report.update({
                where: { id: reportId },
                data: { status: 'completed', filePath: filePath }
            });
        } catch (error) {
            console.error(`Failed to process report: ${error.message}`);
            await this.prisma.report.update({
                where: { id: reportId },
                data: { status: 'failed' }
            });
            // throw new HttpException(`Failed to process report: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
