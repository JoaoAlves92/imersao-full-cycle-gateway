package kafka

import (
	"log"

	"github.com/JoaoAlves92/imersao5-gateway/adapter/presenter"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

type Producer struct {
	ConfigMap *ckafka.ConfigMap
	Presenter presenter.Presenter
}

func NewKafkaProducer(configMap *ckafka.ConfigMap, presenter presenter.Presenter) *Producer {
	return &Producer{ConfigMap: configMap, Presenter: presenter}
}

func (p *Producer) Publish(msg interface{}, key []byte, topic string) error {
	producer, err := ckafka.NewProducer(p.ConfigMap)
	if err != nil {
		log.Print("Erro no producer", err)
		return err
	}
	err = p.Presenter.Bind(msg)
	if err != nil {
		return err
	}
	presenterMsg, err := p.Presenter.Show()
	if err != nil {
		return err
	}
	message := &ckafka.Message{
		// future refactor
		TopicPartition: ckafka.TopicPartition{Topic: &topic, Partition: ckafka.PartitionAny},
		// TopicPartition: ckafka.TopicPartition{Topic: &topic, Partition: int32(0)},
		Value: presenterMsg,
		Key:   key,
	}
	err = producer.Produce(message, nil)
	if err != nil {
		panic(err)
	}
	return nil
}
