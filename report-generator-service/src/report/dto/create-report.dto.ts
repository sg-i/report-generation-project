import {IsNotEmpty, IsArray, IsString} from 'class-validator'

export class CreateReportDto{
    @IsNotEmpty()
    @IsString()
    requesterServiceName: string;

    @IsNotEmpty()
    @IsString()
    endpoint: string;
    
    @IsArray()
    @IsString({ each: true })
    headers: string[];

}