package factory

import "github.com/JoaoAlves92/imersao5-gateway/domain/repository"

type RepositoryFactory interface {
	CreateTransactionRepository() repository.TransactionRepository
}
