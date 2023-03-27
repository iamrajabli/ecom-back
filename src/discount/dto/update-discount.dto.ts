import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpdateDiscountDto {
  @IsOptional()
  @IsDate()
  startDate: Date;

  @IsOptional()
  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsNumber()
  percent: number;
}
