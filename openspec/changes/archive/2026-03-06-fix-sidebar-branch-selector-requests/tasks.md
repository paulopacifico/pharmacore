## 1. Hook useBranchSelectorData

- [x] 1.1 Criar `packages/branch/web/src/data/hooks/use-branch-selector-data.hook.ts` com os estados `initialBranches`, `branches`, `isLoading`, `search` e o `useDebounce` interno
- [x] 1.2 Implementar o `useEffect` de montagem: chama `branchApi.getBranches({ page: 1, pageSize: 10 })`, salva em `initialBranches` e em `branches`, gerencia `isLoading`
- [x] 1.3 Implementar o `useEffect` que observa `debouncedSearch`: se não vazio → chama `branchApi.getBranches({ page: 1, pageSize: 10, name: debouncedSearch })` e atualiza `branches`; se vazio → `setBranches(initialBranches)` sem requisição
- [x] 1.4 Exportar o hook pelo barrel `packages/branch/web/src/data/hooks/index.ts` (criar o barrel se não existir)
- [x] 1.5 Garantir que o hook é re-exportado pelo index principal do pacote `packages/branch/web/src/index.ts`

## 2. Sidebar: substituir consumo do contexto pelo hook

- [x] 2.1 Importar `useBranchSelectorData` de `@pharmacore/branch-web` no sidebar
- [x] 2.2 Substituir os estados locais `searchInput` e `debouncedSearch` (e o `useEffect` de debounce) pelo retorno do hook: `const { branches, isLoading, search, setSearch } = useBranchSelectorData()`
- [x] 2.3 Remover as chamadas a `searchByName` e `clearSearch` do `useBranch()` — inclusive do `useEffect` do debounce e do `closeDropdown`
- [x] 2.4 Atualizar `closeDropdown` para chamar apenas `setSearch("")` em vez de `clearSearch()`
- [x] 2.5 Atualizar o `onChange` do input para chamar `setSearch` em vez de `setSearchInput`
- [x] 2.6 Remover `searchByName` e `clearSearch` da desestruturação de `useBranch()` no sidebar
