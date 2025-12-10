# TODO List Application

Uma aplicação completa de TODO list construída com React (frontend), NestJS (backend), PostgreSQL (banco de dados) e Docker Compose para orquestração.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React** com TypeScript
- **Axios** para requisições HTTP
- **CSS3** para estilização
- **Create React App** como base

### Backend
- **NestJS** com TypeScript
- **TypeORM** para ORM
- **PostgreSQL** como banco de dados
- **Class Validator** para validação de dados
- **CORS** habilitado para comunicação frontend/backend

### Infraestrutura
- **Docker & Docker Compose** para containerização
- **PostgreSQL 15 Alpine** container para banco de dados

## 📁 Estrutura do Projeto

```
c216/
├── docker-compose.yml          # Orquestração dos containers
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── controllers/        # Controllers da API
│   │   ├── services/          # Lógica de negócio
│   │   ├── entities/          # Entidades TypeORM
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── modules/           # Módulos NestJS
│   │   ├── app.module.ts      # Módulo principal
│   │   └── main.ts            # Entry point
│   ├── init.sql               # Script de inicialização do banco
│   ├── Dockerfile             # Container do backend
│   └── package.json
└── frontend/                   # Aplicação React
    ├── src/
    │   ├── components/         # Componentes React
    │   ├── services/          # Serviços para API
    │   ├── App.tsx            # Componente principal
    │   └── index.tsx          # Entry point
    ├── Dockerfile             # Container do frontend
    └── package.json
```

## 🛠️ Como Executar

### Pré-requisitos
- Docker
- Docker Compose
- Node.js (para desenvolvimento local)

### Executar com Docker Compose (Recomendado)

1. Clone o repositório e navegue até a pasta:
```bash
cd c216
```

2. Execute todos os serviços:
```bash
docker-compose up --build
```

3. Aguarde a inicialização de todos os containers. A aplicação estará disponível em:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

### Executar para Desenvolvimento Local

#### Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend (React)
```bash
cd frontend
npm install
npm start
```

#### PostgreSQL
Você pode usar o container do PostgreSQL:
```bash
docker run -d \
  --name todo-postgres \
  -e POSTGRES_DB=todolist \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

## 🔧 Funcionalidades

### ✅ Backend (API REST)
- **GET /todos** - Listar todos os TODOs
- **GET /todos/:id** - Buscar TODO por ID
- **POST /todos** - Criar novo TODO
- **PATCH /todos/:id** - Atualizar TODO
- **PATCH /todos/:id/toggle** - Alternar status de conclusão
- **DELETE /todos/:id** - Deletar TODO

### ✅ Categories API
- **GET /categories** - Listar todas as categorias
- **GET /categories/:id** - Buscar categoria por ID
- **GET /categories/stats** - Estatísticas das categorias
- **POST /categories** - Criar nova categoria
- **PATCH /categories/:id** - Atualizar categoria
- **DELETE /categories/:id** - Deletar categoria

### ✅ Frontend (Interface Web)
- ✅ **Gerenciamento de TODOs**
  - Interface moderna e responsiva
  - Adicionar, editar, deletar TODOs
  - Marcar como concluído/não concluído
  - Filtrar por status (Todos, Ativos, Concluídos)
  - Associar TODOs a múltiplas categorias
  - Estatísticas em tempo real

- ✅ **Gerenciamento de Categorias**
  - Página dedicada para gerenciar categorias
  - Criar categorias com nome, descrição e cor
  - Editar e deletar categorias
  - Visualizar TODOs associados a cada categoria
  - Seletor de cores com paleta predefinida

- ✅ **Navegação e UX**
  - Navegação entre páginas com React Router
  - Tratamento de erros
  - Estados de loading
  - Interface responsiva

### ✅ Banco de Dados
- ✅ Tabela `todos` com campos:
  - `id`, `title`, `description`, `completed`, `created_at`, `updated_at`
- ✅ Tabela `categories` com campos:
  - `id`, `name`, `description`, `color`, `created_at`, `updated_at`
- ✅ Tabela de relacionamento `todo_categories` (many-to-many)
- ✅ Índices para performance
- ✅ Dados de exemplo pré-carregados

## 🐛 Solução de Problemas

### Backend não conecta com o banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `docker-compose.yml`
- Verifique os logs: `docker-compose logs backend`

### Frontend não consegue se comunicar com o backend
- Verifique se o backend está rodando na porta 3001
- Confirme a variável `REACT_APP_API_URL` no frontend
- Verifique se o CORS está habilitado

### Problemas com Docker
- Rebuild os containers: `docker-compose up --build`
- Limpe os containers: `docker-compose down -v`
- Verifique se as portas não estão ocupadas

## 📝 Próximos Passos / Melhorias

- [ ] Autenticação e autorização de usuários
- [ ] Filtros por categoria na página de TODOs
- [ ] Busca/pesquisa de TODOs e categorias
- [ ] Data de vencimento para TODOs
- [ ] Prioridades para TODOs
- [ ] Notificações
- [ ] Testes automatizados (frontend e backend)
- [ ] Deploy em produção
- [ ] PWA (Progressive Web App)
- [ ] Modo escuro
- [ ] Exportar/importar dados
- [ ] API de estatísticas mais avançadas

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
