import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { PaginationQuery } from '../interfaces/http.interface';

export const Pagination = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  let itemsPerPage = 20,
    pageNumber = 1;

  if (request.query !== undefined) {
    if (request.query['itemsPerPage']) itemsPerPage = parseInt(request.query['l'], 10);
    if (request.query['pageNumber']) pageNumber = parseInt(request.query['p'], 10);

    if (itemsPerPage < -1) throw new BadRequestException('invalid limit param!');
    if (pageNumber < 1) throw new BadRequestException('invalid page param!');
  }

  return {
    itemsPerPage,
    pageNumber,
  } as PaginationQuery;
});
