import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

const counterList = [
  {
    name: 'error_database',
    help: 'Number of database errors',
  },
  {
    name: 'error_application',
    help: 'Number of runtime errors',
  },
  {
    name: 'payment_created_count',
    help: 'Number of payments created',
  },
];

export const PROMETHEUS_METRICS_TYPES = counterList.map((el) => {
  return makeCounterProvider({
    name: el.name,
    help: el.help,
  });
});
