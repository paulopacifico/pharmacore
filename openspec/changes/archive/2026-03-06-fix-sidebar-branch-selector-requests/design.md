## Context

O `BranchContext` expõe estado reativo (`nameFilter`, `page`) que é sincronizado com o backend via `useEffect`. Quando o sidebar chama `searchByName` ou `clearSearch`, ele muta esse estado compartilhado, disparando um novo `fetchBranches` que afeta todos os consumidores do contexto (páginas de gestão, tabelas, etc.).

O sidebar precisa de um comportamento diferente:
- Carregar as primeiras 10 filiais **uma única vez** ao montar
- Ao buscar, chamar a API **pontualmente** sem alterar o estado global
- Ao limpar a busca ou fechar o dropdown, **voltar à lista em cache** sem nova requisição

## Goals / Non-Goals

**Goals:**
- Zero requisições extras causadas pela interação com o dropdown do sidebar
- Isolamento completo do estado de listagem/busca do sidebar em relação ao `BranchContext`
- O `BranchContext` continua inalterado e funcionando normalmente para outros consumidores

**Non-Goals:**
- Não alterar a paginação do sidebar (pageSize 10 é suficiente para o seletor)
- Não extrair a seleção de filial (`selectedBranch`/`setSelectedBranch`) do `BranchContext` — isso permanece lá

## Decisions

### 1. Hook `useBranchSelectorData` isolado

Criar `packages/branch/web/src/data/hooks/use-branch-selector-data.hook.ts` com:

```ts
{
  branches: BranchDetailsDTO[];   // lista atual (inicial ou resultado de busca)
  isLoading: boolean;
  search: string;
  setSearch: (value: string) => void;
}
```

Internamente:
- `initialBranches: BranchDetailsDTO[]` — cache da primeira carga (nunca resetado)
- `branches` — `initialBranches` quando `search` vazio, resultado da API quando não vazio
- Usa `useDebounce(search, 300)` para disparar a busca
- No `useEffect` que observa o debounced value: se não vazio → chama `branchApi.getBranches({ page: 1, pageSize: 10, name })` diretamente; se vazio → `setBranches(initialBranches)` sem requisição

Vantagens:
- O sidebar só expõe `search`/`setSearch` — sem `searchByName`/`clearSearch` do contexto
- Fechar o dropdown limpa `search` localmente → o hook reverte para `initialBranches` sem nenhuma chamada HTTP
- Nenhum estado global é mutado

Alternativa descartada: continuar usando `BranchContext.searchByName` mas com um flag que bloqueia o `useEffect` do contexto quando chamado pelo sidebar. Rejeitado por ser acoplamento implícito e difícil de manter.

### 2. O sidebar controla o `search` localmente via `setSearch` do hook

O sidebar remove `searchInput` e `debouncedSearch` como estados próprios — o hook encapsula isso. O sidebar apenas passa o valor do input para `setSearch`.

### 3. `closeDropdown` apenas limpa `search` via `setSearch("")`

Com o hook gerenciando o debounce internamente, chamar `setSearch("")` é suficiente para reverter à lista cached. Não existe mais chamada explícita a `clearSearch`.

## Risks / Trade-offs

- **Cache desatualizado**: se uma filial for criada/editada em outra aba durante a sessão, o seletor pode mostrar dados desatualizados. Mitigação aceitável — o seletor é uma listagem de conveniência; o usuário pode recarregar a página.
- **Duplicação da chamada inicial**: o `BranchContext` também faz um `fetchBranches` na montagem. Ao adicionar o hook, há duas chamadas paralelas na primeira renderização. Aceitável — são chamadas independentes com finalidades distintas.
