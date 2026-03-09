### Coisas importantes para se lembrar

1. Métodos de insert, update & delete retornam void
2. O repositório tem só operações que alteram dados e um findById, demais consultas ficam num arquivo irmão do repositório que é um arquivo de queries. Nesse arquivo de queries, as saídas são DTOs de Lista (ProductListDTO, etc.) ou de details (ProductDetailsDTO)
3. Tipos de In & Out só serão usados nos casos de uso
4. O FindById é do repositório, e quando eu precisar buscar por id nas queries eu chamo de findDetailsById
5. No frontend, os meus contextos vão usar os tipos do DTO ao invés da entidade de domínio
6. Coisas que editam se chamam update
7. No backend casos de uso de update usam o verbo Patch do HTTP
8. Coisas que buscam dados usam a nomenclatura find
