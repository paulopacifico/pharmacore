## Context

O projeto possui dois módulos com queries paginadas (`auth` e `product`) que adotaram contratos de paginação distintos:

| Aspecto | `auth` (find-all-users) | `product` (find-many-products) |
|---|---|---|
| Envelope de saída | `{ data: T[], meta: { page, pageSize, total, totalPages } }` | `{ products: T[], totalPages, totalItems }` (campos planos) |
| Campo de itens | `data` (genérico) | `products` (acoplado ao domínio) |
| Metadados | Objeto `meta` separado | Campos no nível raiz |
| `page` no retorno | Sim | Não |
| `pageSize` no retorno | Sim | Não |

O padrão de `auth` é superior: é mais extensível (adiciona campos ao `meta` sem quebrar destructuring de `data`), é genérico (não vaza nome de entidade no DTO), e já inclui `page` e `pageSize` para evitar que o consumidor precise rastrear o estado de paginação externamente.

## Goals / Non-Goals

**Goals:**
- Criar tipos genéricos de paginação em `@pharmacore/shared` reutilizáveis por qualquer módulo
- Migrar `ProductListDTO` para o envelope padrão, tornando o campo de itens `data`
- Manter e validar o padrão já correto do módulo `auth` (zero alteração de comportamento)
- Garantir que novos módulos paginados usem os tipos compartilhados automaticamente

**Non-Goals:**
- Alterar lógica de cálculo de paginação nas implementações Prisma
- Adicionar novas funcionalidades de paginação (cursor-based, infinite scroll, etc.)
- Modificar controllers ou frontend além do mínimo necessário para compilar

## Decisions

### 1. Onde colocar os tipos compartilhados

**Decisão**: `packages/shared/core/src/dto/pagination.dto.ts`, exportado por `packages/shared/core/src/index.ts`.

**Alternativas consideradas**:
- Criar pacote `@pharmacore/pagination`: overhead desnecessário para apenas 3 interfaces
- Manter em cada módulo e importar entre si: cria dependência circular entre pacotes

**Rationale**: `@pharmacore/shared` já é a dependência universal do projeto. Adicionar um subdiretório `dto/` segue o padrão existente de `base/` e `db/`.

---

### 2. Nome do campo de itens no envelope

**Decisão**: `data: T[]` — campo genérico, não acoplado ao domínio.

**Alternativas consideradas**:
- Manter `products`, `users`, etc. por módulo: impede o uso de tipo genérico compartilhado
- `items`: válido, mas `data` já está em uso no padrão `auth` consolidado

**Rationale**: `data` é o nome canônico de listas em respostas de API REST (JSON:API, GitHub API, etc.). Já funciona no módulo `auth` sem atrito.

---

### 3. Tipagem do input de paginação

**Decisão**: Interface `PaginatedInputDTO` com `page: number` e `pageSize: number` como base, composta via intersection com filtros específicos de cada módulo.

```ts
// Uso no módulo product:
type ProductQueryDTO = PaginatedInputDTO & ProductFiltersDTO;
```

**Rationale**: Intersection types permitem que cada módulo estenda sem herança de classe ou generics complexos no input.

---

### 4. Compatibilidade do módulo auth

**Decisão**: Refatorar `FindAllUsersInDTO` e `FindAllUsersOutDTO` para derivar dos tipos compartilhados — sem alterar os campos exportados (renomear `FindAllUsersMetaDTO` passa a ser `PaginationMetaDTO`).

**Impacto**: Apenas ajuste de tipos — sem breaking change nos consumers de `auth` já que os campos são idênticos.

## Risks / Trade-offs

- **[Risk] Breaking change no ProductListDTO** → Os consumers (controller, frontend) que leem `products.products` ou `products.totalItems` precisarão ser atualizados para `products.data` e `products.meta.totalItems`. Mitigação: buscar todos os usos com grep antes de iniciar a migração.
- **[Trade-off] `data` é pouco descritivo** → Em contrapartida, é esperado por convenção REST e permite tipos genéricos. O nome do DTO (`ProductListDTO`) ainda contextualiza o conteúdo.

## Migration Plan

1. Criar `packages/shared/core/src/dto/pagination.dto.ts` com os 3 tipos
2. Exportar via `packages/shared/core/src/index.ts`
3. Refatorar `auth` DTOs para usar tipos compartilhados (non-breaking)
4. Refatorar `ProductListDTO` para usar `PaginatedResultDTO<ProductListItem>` (**breaking**)
5. Atualizar a implementação Prisma do produto para montar o envelope `{ data, meta }`
6. Buscar e corrigir todos os consumers de `ProductListDTO` que referenciam campos renomeados

**Rollback**: Reverter commit — não há migração de banco envolvida.

## Open Questions

- `ProductFiltersDTO` já inclui `page` e `pageSize`? Se sim, esses campos serão substituídos pela composição com `PaginatedInputDTO` (evita duplicação).
