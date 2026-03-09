## 1. Criar tipos compartilhados em @pharmacore/shared

- [x] 1.1 Criar `packages/shared/core/src/dto/pagination.dto.ts` com as interfaces `PaginatedInputDTO`, `PaginationMetaDTO` e `PaginatedResultDTO<T>`
- [x] 1.2 Criar `packages/shared/core/src/dto/index.ts` exportando os tipos de paginação
- [x] 1.3 Adicionar `export * from "./dto"` em `packages/shared/core/src/index.ts`

## 2. Migrar módulo auth para usar tipos compartilhados

- [x] 2.1 Atualizar `packages/auth/core/src/user/dto/find-all-users.dto.ts`: substituir `FindAllUsersMetaDTO` por `PaginationMetaDTO` do shared, `FindAllUsersInDTO` por alias de `PaginatedInputDTO`, `FindAllUsersOutDTO` por alias de `PaginatedResultDTO<UserDTO>`
- [x] 2.2 Verificar que nenhum consumer de `FindAllUsersMetaDTO` existe fora do próprio dto (grep em auth)
- [x] 2.3 Confirmar que `FindAllUsersQuery` compila sem erros após o ajuste

## 3. Migrar módulo product — DTO e contrato de query

- [x] 3.1 Remover o campo `page?: number` de `ProductFiltersDTO` em `packages/product/core/src/product/dto/product-filters.dto.ts`
- [x] 3.2 Criar novo tipo de input composto `ProductQueryDTO = PaginatedInputDTO & ProductFiltersDTO` em `packages/product/core/src/product/dto/`
- [x] 3.3 Substituir `ProductListDTO` em `packages/product/core/src/product/dto/product-list.dto.ts` para ser alias de `PaginatedResultDTO<ProductListItem>`
- [x] 3.4 Atualizar `FindManyProductsWithFiltersQuery` para receber `ProductQueryDTO` e retornar `PaginatedResultDTO<ProductListItem>`

## 4. Atualizar implementação Prisma do produto

- [x] 4.1 Localizar o adapter/repositório Prisma que implementa `FindManyProductsWithFiltersQuery`
- [x] 4.2 Atualizar o mapeamento de saída para montar `{ data: [...], meta: { page, pageSize, total, totalPages } }` em vez de `{ products: [...], totalPages, totalItems }`
- [x] 4.3 Garantir que `page` e `pageSize` são lidos do input (via `ProductQueryDTO`) e repassados ao Prisma `skip`/`take`

## 5. Corrigir consumers do ProductListDTO

- [x] 5.1 Buscar todos os arquivos que referenciam `products.products`, `.totalItems` ou `.totalPages` fora do `meta`
- [x] 5.2 Atualizar controllers que constroem a resposta HTTP de listagem de produtos para ler `data` e `meta`
- [x] 5.3 Atualizar frontend (se aplicável) que consome a listagem de produtos

## 6. Validação final

- [x] 6.1 Rodar `tsc --noEmit` em todos os pacotes afetados e garantir zero erros
- [x] 6.2 Executar testes unitários dos módulos `auth` e `product`
- [x] 6.3 Confirmar que a spec `pagination-contract` é atendida revisando os pontos de `data`, `meta`, `page`, `pageSize`, `total` e `totalPages` nos retornos reais
