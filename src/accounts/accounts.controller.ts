// import {
//   Controller,
//   Get,
//   Post,
//   Patch,
//   Delete,
//   Query,
//   Param,
//   Body,
//   HttpCode,
//   HttpStatus,
//   BadRequestException,
//   NotFoundException,
// } from '@nestjs/common';
// // import { ApiTags } from '@nestjs/swagger';
// import { NatsClient } from '@nestjs-ex/nats-strategy';
// import { firstValueFrom } from 'rxjs';
// import { CreateAccountDto } from './dto/create-account.dto';
// import { UpdateAccountDto } from './dto/update-account.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';

// // @ApiTags('account')
// @Controller('api/v1/admin/account')
// export class AccountsController {
//   constructor(
//     private readonly natsService: NatsClient,
//     @InjectModel(Page.name) private pageModel: Model<PageDocument>,
//   ) { }

// }
