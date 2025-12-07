import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetadata {
  @ApiProperty({ description: 'Página atual' })
  currentPage: number;

  @ApiProperty({ description: 'Itens por página' })
  itemsPerPage: number;

  @ApiProperty({ description: 'Total de itens' })
  totalItems: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages: number;

  @ApiProperty({ description: 'Tem próxima página' })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Tem página anterior' })
  hasPreviousPage: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Dados da página atual', isArray: true })
  data: T[];

  @ApiProperty({ description: 'Metadados da paginação', type: PaginationMetadata })
  meta: PaginationMetadata;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.meta = {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };
  }
}
