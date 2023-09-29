import { IsNotEmpty, IsCreditCard, Min, Max } from 'class-validator';
export class CreateOrderDto {
  @IsNotEmpty()
  @Min(1)
  @Max(1000)
  amount: number;

  @IsNotEmpty()
  @IsCreditCard()
  credit_card_number: string;

  @IsNotEmpty()
  credit_card_name: string;

  @IsNotEmpty()
  credit_card_expiration_month: number;

  @IsNotEmpty()
  credit_card_expiration_year: number;

  @IsNotEmpty()
  credit_card_cvv: string;
}
