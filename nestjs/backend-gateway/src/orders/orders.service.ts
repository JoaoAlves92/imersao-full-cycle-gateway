import { Inject, Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectModel } from '@nestjs/sequelize';
import { AccountStorageService } from 'src/accounts/account-storage/account-storage.service';
import { EmptyResultError } from 'sequelize';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { MetricsService } from 'src/config/metrics/metrics.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    private accountStorage: AccountStorageService,
    @Inject('KAFKA_PRODUCER')
    private kafkaProducer: Producer,
    private readonly metricService: MetricsService
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.orderModel.create({
      ...createOrderDto,
      account_id: this.accountStorage.account.id,
    });
    this.kafkaProducer.send({
      topic: 'transactions',
      messages: [
        {
          key: 'transactions',
          value: JSON.stringify({ ...createOrderDto, ...order.toJSON() }),
        },
      ],
    });
    this.metricService.payment_created_count.inc()
    return order;
  }

  findAll() {
    return this.orderModel.findAll({
      where: {
        account_id: this.accountStorage.account.id,
      },
    });
  }

  findOneUsingAccount(id: string) {
    return this.orderModel.findOne({
      where: {
        id,
        account_id: this.accountStorage.account.id,
      },
      rejectOnEmpty: new EmptyResultError(`Order with ID ${id} not found`),
    });
  }

  findOne(id: string) {
    return this.orderModel.findByPk(id);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const account = this.accountStorage.account;
    const order = await (account
      ? this.findOneUsingAccount(id)
      : this.findOne(id));

    return order.update(updateOrderDto);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    return order.destroy();
  }
}
