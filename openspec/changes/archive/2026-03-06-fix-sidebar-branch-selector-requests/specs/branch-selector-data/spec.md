## ADDED Requirements

### Requirement: Hook useBranchSelectorData carrega filiais uma única vez
O hook `useBranchSelectorData` SHALL fazer uma única chamada à API (`GET /branches?page=1&pageSize=10`) na montagem e armazenar o resultado como `initialBranches`. Nenhuma mudança de estado posterior SHALL disparar nova requisição, exceto uma busca ativa pelo usuário.

#### Scenario: Montagem do hook
- **WHEN** o hook é montado pela primeira vez
- **THEN** uma requisição ao backend é feita para carregar as primeiras 10 filiais
- **THEN** `branches` é populado com o resultado e `isLoading` volta a `false`

#### Scenario: Dropdown fechado e reaberto
- **WHEN** o dropdown é fechado (search limpo) e reaberto
- **THEN** nenhuma nova requisição ao backend é feita
- **THEN** `branches` exibe a lista inicial em cache

### Requirement: Busca pontual sem alterar estado global
Quando `search` for não-vazio após o debounce de 300ms, o hook SHALL chamar `branchApi.getBranches` diretamente com `{ page: 1, pageSize: 10, name: search }` e atualizar `branches` com o resultado. O `BranchContext` não SHALL ser chamado nem ter seu estado alterado.

#### Scenario: Usuário digita um termo de busca
- **WHEN** o usuário digita um termo e o debounce de 300ms decorre
- **THEN** uma requisição ao backend é feita com o nome como filtro
- **THEN** `branches` é atualizado com os resultados filtrados
- **THEN** o estado do `BranchContext` (nameFilter, page) permanece inalterado

#### Scenario: Usuário limpa o campo de busca
- **WHEN** o campo `search` é resetado para string vazia
- **THEN** nenhuma requisição ao backend é feita
- **THEN** `branches` volta a exibir `initialBranches` (lista em cache)

### Requirement: Interface do hook exposta ao sidebar
O hook SHALL retornar `{ branches, isLoading, search, setSearch }`. O sidebar SHALL usar `setSearch` para atualizar o input e MUST NOT chamar `searchByName` ou `clearSearch` do `BranchContext` para fins de listagem.

#### Scenario: Sidebar fecha o dropdown
- **WHEN** o dropdown é fechado
- **THEN** o sidebar chama `setSearch("")`
- **THEN** nenhuma requisição HTTP é disparada
- **THEN** a lista volta ao estado inicial sem chamadas extras

#### Scenario: isLoading reflete apenas a busca ativa
- **WHEN** uma requisição de busca está em andamento
- **THEN** `isLoading` é `true`
- **WHEN** não há busca em andamento (seja na carga inicial completa ou com campo vazio)
- **THEN** `isLoading` é `false`
