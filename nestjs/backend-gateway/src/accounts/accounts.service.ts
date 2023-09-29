import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account)
    private accountModel: typeof Account,
  ) {}

  create(createAccountDto: CreateAccountDto) {
    return this.accountModel.create({...createAccountDto});
  }

  findAll() {
    return this.accountModel.findAll();
  }

  async findOne(id: string) {
    const account = await this.accountModel.findOne({
      where: {
        [Op.or]: [{ id: id }, { token: id }],
      },
    });

    if (!account) {
      throw new HttpException(
        `Account with ID or Token ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return account;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.findOne(id);
    return account.update(updateAccountDto);
  }

  async remove(id: string) {
    const account = await this.findOne(id);
    return account.destroy();
  }
}
