# Imersão Full Stack & FullCycle 5.0 - Back-end das ordens de pagamento

## Descrição

Repositório do back-end das ordens de pagamento feito com Nest.js

**Importante**: A aplicação do Apache Kafka e Golang deve estar rodando primeiro.

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Instalação

```bash
$ yarn
```

## Rodando o projeto

Você pode utlizar o ambiente de desenvolvimento local:

```bash
$ yarn start:dev
```

Ou pode executar o comando para subir um container:

```bash
$ docker-compose up
```

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`KAFKA_CLIENT_ID`

`KAFKA_HOST`

`KAFKA_USE_SSL`

`KAFKA_CONSUMER_GROUP_ID`