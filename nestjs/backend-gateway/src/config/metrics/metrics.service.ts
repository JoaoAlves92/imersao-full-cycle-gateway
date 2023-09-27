import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('error_database') public error_database: Counter<string>,
    @InjectMetric('error_application')
    public error_application: Counter<string>,
    @InjectMetric('payment_created_count')
    public payment_created_count: Counter<string>,
  ) {}
}
