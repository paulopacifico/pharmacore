## Why

O seletor de filiais no sidebar consome o `BranchContext` compartilhado para listar e buscar filiais. O problema é que esse contexto foi projetado para o módulo de gestão de filiais (paginação, CRUD) — qualquer chamada a `searchByName` ou `clearSearch` muta o estado global (`nameFilter`, `page`), disparando o `useEffect` do contexto e fazendo uma nova requisição ao backend. Isso causa:

1. **Requests duplicadas no fechamento do dropdown**: ao chamar `closeDropdown()`, o sidebar chama `clearSearch()` diretamente e, após 300ms, o efeito do debounce chama `clearSearch()` novamente;
2. **Interferência no estado compartilhado**: a busca do sidebar sobrescreve o filtro de nome e a página do contexto, afetando as páginas de gestão de filiais que também dependem do mesmo contexto;
3. **Re-fetch desnecessário ao limpar busca**: fechar o dropdown sem ter buscado nada ainda dispara um `fetchBranches` desnecessário via `clearSearch`.

## What Changes

- Criação de um hook `useBranchSelectorData` no pacote `@pharmacore/branch-web` responsável exclusivamente pelo estado de listagem/busca do seletor do sidebar
- O hook mantém uma lista inicial de filiais em cache local (sem recarregar ao limpar a busca)
- Ao digitar, realiza chamada à API diretamente sem tocar no estado do `BranchContext`
- O sidebar para de usar `searchByName` e `clearSearch` do `BranchContext`
- O `BranchContext` continua inalterado para os demais consumidores

## Capabilities

### New Capabilities

- `branch-selector-data`: Hook `useBranchSelectorData` isolado do `BranchContext`, com lista inicial cached e busca pontual via API sem efeito colateral no estado global.

### Modified Capabilities

## Impact

- **`packages/branch/web`**: novo hook `useBranchSelectorData` e seu export
- **`apps/frontend/src/components/template/sidebar.component.tsx`**: usa o novo hook para listagem/busca em vez de `searchByName`/`clearSearch` do `useBranch()`
- **`BranchContext`**: sem alteração — continua servindo o módulo de gestão normalmente
