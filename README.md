# Vocare CRM

Um sistema moderno de gestão para seminários, focado em centralizar informações acadêmicas, de biblioteca e gestão de pessoas, com uma interface otimizada para dispositivos móveis e desktop.

## 🚀 Tecnologias

- **Frontend**: [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Gerenciamento de Estado**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Ícones**: [Lucide React](https://lucide.dev/)

## 📂 Estrutura do Projeto

O projeto segue uma arquitetura baseada em funcionalidades (**Feature-Based Folder Structure**), o que facilita a escalabilidade e a manutenção.

```text
src/
├── components/       # Componentes globais e UI (Layout, Sidebar, etc)
├── features/         # Lógica de negócio dividida por módulos
│   ├── auth/         # Autenticação e proteção de rotas
│   ├── users/        # Gestão de perfis e membros (seminaristas, professores)
│   ├── library/      # (Em breve) Gestão de livros e empréstimos
│   └── academic/     # (Em breve) Notas, disciplinas e turmas
├── hooks/            # Hooks customizados globais (useAuth, etc)
├── lib/              # Configurações de bibliotecas externas (Supabase Client)
├── types/            # Definições de tipos TypeScript
└── utils/            # Funções utilitárias
```

## 🛠️ Como rodar o projeto

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env` na raiz do projeto com suas credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=seu_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Build para produção**:
   ```bash
   npm run build
   ```

## 📋 Plano de Ação

O desenvolvimento está sendo guiado pelo arquivo [action-plan.md](./action-plan.md).

---
Desenvolvido com ❤️ para a gestão formativa.
