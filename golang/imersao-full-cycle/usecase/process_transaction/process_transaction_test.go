package process_transaction

import (
	"testing"
	"time"

	mock_broker "github.com/JoaoAlves92/imersao5-gateway/adapter/broker/mock"
	"github.com/JoaoAlves92/imersao5-gateway/domain/entity"
	mock_repository "github.com/JoaoAlves92/imersao5-gateway/domain/repository/mock"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
)

func TestProcessTransaction_ExecuteInvalidCreditCard(t *testing.T) {
	input := TransactionDtoInput{
		ID:                        "1",
		AccountID:                 "1",
		CreditCardNumber:          "40000000000000000",
		CreditCardName:            "José da Silva",
		CreditCardExpirationMonth: 12,
		CreditCardExpirationYear:  time.Now().Year(),
		CreditCardCVV:             123,
		Amount:                    200,
	}

	expectedOutput := TransactionDtoOutput{
		ID:           "1",
		Status:       entity.REJECTED,
		ErrorMessage: "invalid credit card number",
	}

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	repositoryMock := mock_repository.NewMockTransactionRepository(ctrl)
	repositoryMock.EXPECT().Insert(input.ID, input.AccountID, input.Amount, expectedOutput.Status, expectedOutput.ErrorMessage).Return(nil)

	producerMock := mock_broker.NewMockProducerInterface(ctrl)

	producerMock.EXPECT().Publish(expectedOutput, []byte(input.ID), "transaction_result")

	usecase := NewProcessTransaction(repositoryMock, producerMock, "transaction_result")
	output, err := usecase.Execute(input)
	assert.Nil(t, err)
	assert.Equal(t, expectedOutput, output)
}

func TestProcessTransaction_ExecuteRejectedTransaction(t *testing.T) {
	input := TransactionDtoInput{
		ID:                        "1",
		AccountID:                 "1",
		CreditCardNumber:          "4193523830170205",
		CreditCardName:            "José da Silva",
		CreditCardExpirationMonth: 12,
		CreditCardExpirationYear:  time.Now().Year(),
		CreditCardCVV:             123,
		Amount:                    1200,
	}

	expectedOutput := TransactionDtoOutput{
		ID:           "1",
		Status:       entity.REJECTED,
		ErrorMessage: "limit excedeed",
	}

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	repositoryMock := mock_repository.NewMockTransactionRepository(ctrl)
	repositoryMock.EXPECT().Insert(input.ID, input.AccountID, input.Amount, expectedOutput.Status, expectedOutput.ErrorMessage).Return(nil)

	producerMock := mock_broker.NewMockProducerInterface(ctrl)

	producerMock.EXPECT().Publish(expectedOutput, []byte(input.ID), "transaction_result")

	usecase := NewProcessTransaction(repositoryMock, producerMock, "transaction_result")

	output, err := usecase.Execute(input)

	assert.Nil(t, err)
	assert.Equal(t, expectedOutput, output)
}

func TestProcessTransaction_ExecuteApprovedTransaction(t *testing.T) {
	input := TransactionDtoInput{
		ID:                        "1",
		AccountID:                 "1",
		CreditCardNumber:          "4193523830170205",
		CreditCardName:            "José da Silva",
		CreditCardExpirationMonth: 12,
		CreditCardExpirationYear:  time.Now().Year(),
		CreditCardCVV:             123,
		Amount:                    900,
	}

	expectedOutput := TransactionDtoOutput{
		ID:           "1",
		Status:       entity.APPROVED,
		ErrorMessage: "",
	}

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	repositoryMock := mock_repository.NewMockTransactionRepository(ctrl)
	repositoryMock.EXPECT().Insert(input.ID, input.AccountID, input.Amount, expectedOutput.Status, expectedOutput.ErrorMessage).Return(nil)

	producerMock := mock_broker.NewMockProducerInterface(ctrl)

	producerMock.EXPECT().Publish(expectedOutput, []byte(input.ID), "transaction_result")

	usecase := NewProcessTransaction(repositoryMock, producerMock, "transaction_result")

	output, err := usecase.Execute(input)

	assert.Nil(t, err)
	assert.Equal(t, expectedOutput, output)
}
