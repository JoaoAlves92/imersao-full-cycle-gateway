package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTransaction_IsValid(t *testing.T) {
	transaction := NewTransaction()

	transaction.ID = "1"
	transaction.AccountID = "1"
	transaction.Amount = 900

	assert.Nil(t, transaction.Isvalid())
}

func TestTransaction_IsNotValidWithAmountGreaterThan100(t *testing.T) {
	transaction := NewTransaction()

	transaction.ID = "1"
	transaction.AccountID = "1"
	transaction.Amount = 1100

	err := transaction.Isvalid()

	assert.Error(t, err)

	assert.Equal(t, "limit excedeed", err.Error())
}

func TestTransaction_IsNotValidWithAmountLessThan1(t *testing.T) {
	transaction := NewTransaction()

	transaction.ID = "1"
	transaction.AccountID = "1"
	transaction.Amount = 0

	err := transaction.Isvalid()

	assert.Error(t, err)

	assert.Equal(t, "the amount must be greater than 1", err.Error())
}
