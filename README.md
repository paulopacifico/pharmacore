# ERP Farmácia

- 🟡: Em desenvolvimento

---

## Rodando o projeto

Para configurar e executar o projeto localmente, **acesse primeiro** o arquivo [setup.md](./setup.md).

Para configurar o MCP de banco (Codex/Claude), use o guia [docs/mcp/codex-mcp-db.md](./docs/mcp/codex-mcp-db.md).

---

## Contextos Delimitados

### Contexto de Identidade e Acesso 🟡

Esse contexto trata especificamente das necessidades de autenticação da aplicação, definindo usuários, papéis e permissões.

#### Entidades

- **Usuário**: Um usuário autenticável para a aplicação.
- **Papel**: Role com uma descrição e uma lista de permissões possíveis.
- **Permissão**: Permissões específicas como LER, ESCREVER, CADASTRAR, etc.

#### Objetos de Valor

- Senha Forte
- Senha Hash

---

### Contexto de Catálogo de Produtos 🟡

Organização e apresentação de produtos para consulta e venda para o cliente final.

#### Entidades

- **Produto**: Um item qualquer vendido na farmácia, como remédios, escovas de cabelo, fraldas, desodorantes, etc. Pode incluir informações vindas do módulo de estoque e inventário para mostrar números.
- **Categoria**: Categorias de produtos.

---

### Contexto de Estoque e Inventário

Esse módulo trata do gerenciamento de quantidade de produtos no estoque da farmácia a nível do estoque físico. Se relaciona com o módulo de compras e fornecedores para entrada de produtos e com o módulo de vendas para saída de produtos.

#### Entidades

- **Item**: Itens no estoque.
- **Movimentação**: Registros de entrada e saída de produtos do estoque.
- **Fabricante**: Fabricante do produto.
- **Relatórios**: Relatórios sobre movimentações do estoque.

#### Objetos de Valor

- Lote
- Localização (dentro do estoque)

---

### Contexto de Vendas e Atendimento

Módulo para gerenciar as vendas da farmácia.

#### Entidades

- **Cliente**: Usuário específico de compra.
- **Atendente**: Funcionário da farmácia que efetuou a venda.
- **ItemVenda**: Produto pedido em uma venda.
- **Venda**: Informa produtos vendidos, valores, descontos, data da compra, etc.

#### Objetos de Valor

- Desconto

---

### Contexto de Gestão de Clientes

Módulo para gerenciar relacionamento com clientes envolvendo fidelização e comunicação.

#### Entidades

- **Cliente**: Uma pessoa que pode comprar na farmácia.
- **Programa de Fidelidade**: Programas de pontos e benefícios que um cliente pode ou não participar.
- **Promoções**: Promoções que podem ser enviadas para o cliente de acordo com suas preferências.
- **Campanhas de Marketing**: Comunicações estratégicas feitas da farmácia para o cliente.
- **Relatórios de Marketing**
- **Relatórios de Vendas**

#### Objetos de Valor

- Pontos (necessários para o programa de fidelidade)

---

### Contexto de Compras e Fornecedores

Contexto para lidar com as compras que a farmácia faz de fornecedores.

#### Entidades

- **Fornecedor**: Transportadora.
- **Pedido**: Solicitação de compra dos itens da farmácia.
- **Item Pedido**: Item solicitado dentro de um pedido.
- **Fabricante**: Quem fabrica o produto.
- **Recebimento da Mercadoria**: Entidade com detalhes referentes ao recebimento.
- **Relatórios de Suprimentos**

---

### Contexto Financeiro

Contexto relacionado a finanças gerais da farmácia, como pagamentos, recebimentos e fluxo de caixa.

#### Entidades

- **Recebimentos Futuros**: Valores que serão pagos no futuro como vendas fiado.
- **Pagamentos Futuros**: Valores a serem pagos posteriormente como aluguel, luz, fornecedores, etc.
- **Pagamento de Funcionário**
- **Venda**: Vendas para clientes.
- **Compras**: Compras de fornecedores.
- **Fechamento de Caixa**: Fechamento diário do caixa.
- **Relatório**: Diferentes relatórios financeiros.

---

### Contexto de Funcionários

Contexto para gerenciar funcionários, cargos e escalas.

#### Entidades

- **Funcionário**
- **Cargo**
- **Escala**
- **Folha de Pagamento**: Dados de pagamento por usuário que serão enviados para o financeiro.

#### Objetos de Valor

- Salário

---

## Objetos de Valor Comuns

- Id
- Endereço
- Email
- CPF
- CNPJ
- Telefone
- Data e Hora
- Nome Completo
- Nota Fiscal
- Valor Monetário
- Receita Médica
- Código de Barras
- Registro Anvisa
- Pagamento (incluindo formas de pagamento diferentes e taxas de acordo com as formas de pagamento)
