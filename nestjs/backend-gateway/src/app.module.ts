import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { join } from 'path';
import { Order } from './orders/entities/order.entity';
import { AccountsModule } from './accounts/accounts.module';
import { Account } from './accounts/entities/account.entity';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    ConfigModule.forRoot(),
    OrdersModule,
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: join(__dirname, 'database.sqlite'),
      autoLoadModels: true,
      models: [Order, Account],
      synchronize: true
      // sync: {
      //   alter: true,
      //   // force: true,
      // },
    }),
    AccountsModule,
    PrometheusModule.register({})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
