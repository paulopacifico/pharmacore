## Why

Existem dois padrões de paginação coexistindo no projeto: o módulo `auth` usa um envelope estruturado com `data` + `meta`, enquanto `product` usa campos planos (`products`, `totalPages`, `totalItems`). Essa inconsistência força os consumidores (frontend, casos de uso, controllers) a lidar com contratos diferentes para a mesma operação.

## What Changes

- Introdução de interfaces genéricas compartilhadas `PaginatedInputDTO<F>` e `PaginatedResultDTO<T>` em `@pharmacore/shared`
- O campo de resultado sempre segue o envelope `{ data: T[], meta: PaginationMetaDTO }` — padrão já adotado em `auth`
- O campo de entrada sempre expõe `page` e `pageSize` — podendo ser composto com filtros específicos de cada módulo
- **BREAKING**: `ProductListDTO` substituído por `PaginatedResultDTO<ProductListItem>` — campo `products` passa a ser `data`, e `totalItems`/`totalPages` vão para `meta`
- Todos os DTOs de saída paginados passam a usar o mesmo envelope `meta`

## Capabilities

### New Capabilities

- `pagination-contract`: Interfaces genéricas de paginação (`PaginatedInputDTO`, `PaginationMetaDTO`, `PaginatedResultDTO`) em `@pharmacore/shared`

### Modified Capabilities

<!-- Nenhuma spec existente a modificar — specs ainda não existem no projeto -->

## Impact

- `packages/shared/core/src/` — novos tipos genéricos de paginação
- `packages/auth/core/src/user/dto/find-all-users.dto.ts` — refatorar para usar os tipos compartilhados
- `packages/product/core/src/product/dto/product-list.dto.ts` — **BREAKING**: substituir `ProductListDTO` por `PaginatedResultDTO<ProductListItem>`
- `packages/product/core/src/product/provider/find-many-products-with-filters.query.ts` — atualizar tipo de retorno
- Implementações Prisma/adapters que constroem esses DTOs precisarão mapear para o novo envelope
- Frontend/controllers que consomem `ProductListDTO` precisarão ser atualizados
