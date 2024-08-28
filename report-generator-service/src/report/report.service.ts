import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
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
    // Макс. количество строк в получаемых данных за один запрос
    private chunk_size= 15;

    // Создание отчета. Выдача его id
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

            // Запуск обработки отчета (создание excel)
            this.processReport(reportId, createReportDto);

            return reportId;
        } catch (error) {
            throw new HttpException(`Failed to create report: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // Получение статуса создание отчета
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
                url: report.status === 'completed' ? `http://localhost:3001/report/${id}/download` : null,
            };
        } catch (error) {
            throw new HttpException(`Failed to get report status: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // Скачивание excel файла по ссылке
    async downloadReport(id: string) {
        try {
            const report = await this.prisma.report.findUnique({
                where: { id }
            });

            if (!report || !fs.existsSync(report.filePath)) {
                throw new NotFoundException(`Report with ID ${id} not found`);
            }

            return report.filePath;
        } catch (error) {
            throw new HttpException(`Failed to get report status: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Получение данных с сервиса заказчика
    private async fetchDataFromRequester(endpoint: string, page: number) {
        const response = await axios.get(endpoint,{
            params:{
                page,
                size: this.chunk_size
        }});
        return response.data;
    }

    // Обработка отчета
    private async processReport(reportId: string, createReportDto: CreateReportDto) {
        try {
            const { endpoint, headers } = createReportDto;
            let page = 1;
            let hasMoreData = true;
            let filePath = path.join(__dirname, '..', 'reports', `report-${reportId}.xlsx`);

            if (!fs.existsSync(path.dirname(filePath))) {
                fs.mkdirSync(path.dirname(filePath), { recursive: true });
            }

            while(hasMoreData){
                const data = await this.fetchDataFromRequester(endpoint, page);
                if(data.length===0){
                    hasMoreData=false;
                }
                else{
                    if (!fs.existsSync(filePath)) {
                        // Создание новой книги и добавление заголовков
                        const workbook = XLSX.utils.book_new();
                        const worksheet = XLSX.utils.aoa_to_sheet([headers]);
        
                        // Добавление данных
                        XLSX.utils.sheet_add_json(worksheet, data, { skipHeader: true, origin: -1 });
                        
                        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
                        XLSX.writeFile(workbook, filePath);
                    } else {
                        // Загрузка существующего файла и добавление данных
                        const workbook = XLSX.readFile(filePath);
                        const worksheet = workbook.Sheets['Report'];
        
                        // Добавление данных
                        XLSX.utils.sheet_add_json(worksheet, data, { skipHeader: true, origin: -1 });
        
                        XLSX.writeFile(workbook, filePath);
                    }
                    page++;
                }
            }

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
        }
    }
}
