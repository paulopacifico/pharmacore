## ADDED Requirements

### Requirement: Tipos genéricos de paginação em shared
O sistema SHALL expor em `@pharmacore/shared` as interfaces `PaginatedInputDTO`, `PaginationMetaDTO` e `PaginatedResultDTO<T>` para uso por qualquer módulo do monorepo.

#### Scenario: Importação dos tipos de paginação
- **WHEN** um módulo importa de `@pharmacore/shared`
- **THEN** os tipos `PaginatedInputDTO`, `PaginationMetaDTO` e `PaginatedResultDTO` devem estar disponíveis sem importações adicionais

#### Scenario: Instanciação genérica do resultado
- **WHEN** um DTO de saída for definido como `PaginatedResultDTO<ProductListItem>`
- **THEN** o TypeScript SHALL inferir `data: ProductListItem[]` e `meta: PaginationMetaDTO` sem necessidade de redefinição

---

### Requirement: Envelope de saída padronizado
Toda query paginada SHALL retornar um objeto com exatamente dois campos de topo: `data` (array de itens) e `meta` (metadados de paginação).

#### Scenario: Estrutura do resultado de find-all-users
- **WHEN** `FindAllUsersQuery.execute` retorna com sucesso
- **THEN** o `Result` SHALL conter `{ data: UserDTO[], meta: { page, pageSize, total, totalPages } }`

#### Scenario: Estrutura do resultado de find-many-products
- **WHEN** `FindManyProductsWithFiltersQuery.execute` retorna com sucesso
- **THEN** o `Result` SHALL conter `{ data: ProductListItem[], meta: { page, pageSize, total, totalPages } }`
- **THEN** o campo `products` NÃO SHALL existir no resultado

#### Scenario: Metadados de paginação completos
- **WHEN** qualquer query paginada retorna com sucesso
- **THEN** `meta.page` SHALL ser o número da página atual (1-indexed)
- **THEN** `meta.pageSize` SHALL ser o número de itens por página solicitado
- **THEN** `meta.total` SHALL ser o total de itens no banco para os filtros aplicados
- **THEN** `meta.totalPages` SHALL ser `Math.ceil(meta.total / meta.pageSize)`

---

### Requirement: Entrada de paginação padronizada
Todo DTO de entrada paginado SHALL incluir os campos `page: number` e `pageSize: number`.

#### Scenario: Campos de paginação no input de usuários
- **WHEN** `FindAllUsersQuery.execute` é chamada
- **THEN** o input SHALL incluir `page` e `pageSize` como campos obrigatórios

#### Scenario: Campos de paginação no input de produtos
- **WHEN** `FindManyProductsWithFiltersQuery.execute` é chamada
- **THEN** o input SHALL incluir `page` e `pageSize` sem duplicação com `ProductFiltersDTO`
- **THEN** `ProductFiltersDTO` NÃO SHALL conter `page` como campo próprio

---

### Requirement: DTOs de módulo derivam dos tipos compartilhados
Os DTOs de entrada e saída de cada módulo SHALL ser definidos como composições ou extensões dos tipos genéricos de `@pharmacore/shared`.

#### Scenario: FindAllUsersInDTO baseado em PaginatedInputDTO
- **WHEN** `FindAllUsersInDTO` é inspecionado
- **THEN** SHALL ser equivalente a `PaginatedInputDTO` (pode ser um alias de tipo ou interface que a estende)

#### Scenario: FindAllUsersOutDTO baseado em PaginatedResultDTO
- **WHEN** `FindAllUsersOutDTO` é inspecionado
- **THEN** SHALL ser equivalente a `PaginatedResultDTO<UserDTO>`

#### Scenario: ProductListDTO baseado em PaginatedResultDTO
- **WHEN** `ProductListDTO` é inspecionado (ou seu substituto)
- **THEN** SHALL ser equivalente a `PaginatedResultDTO<ProductListItem>`
