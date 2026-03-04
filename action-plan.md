# Plano de Ação - Vocare CRM

## 1. Plano de Ação por Versões

### Versão 1.0 (MVP - O Core)
*Foco em tirar o processo do papel e centralizar as informações básicas.*

- **Auth & Permissões**: Login via Supabase Auth e níveis de acesso (Admin, Formador, Seminarista, Professor).
- **Gestão de Pessoas**: Cadastro de perfis com etapa formativa (Menor,Propedêutico, Filosofia, Teologia) e status (Ativo, Egresso, etc.).
- **Biblioteca Essencial**: Cadastro de livros e fluxo de empréstimo manual com status.
- **Dashboard Simples**: Resumo de quantos livros estão atrasados e total de seminaristas por etapa.

### Versão 1.1 (Acadêmico & Acervo Digital)
- **Módulo Acadêmico**: Cadastro de disciplinas, cursos, turmas e lançamento de notas finais, cada turma tem um professor, o professor pode ser um dos formadores de modo que o login dele seja o mesmo do sistema ou um professor convidado.
- **Boletim do Aluno**: Visão exclusiva para o seminarista acompanhar seu progresso.
- **Acervo Digital**: Aba com o iframe do Google Drive.

### Versão 2.0 (Integrações & Escalas)
- **Google Classroom**: Sincronização de materiais.
- **App de Escalas**: Integração do seu sistema existente (Liturgia, Cozinha, Faxina).
- **Notificações**: Alertas de livros atrasados via e-mail ou push.

---

## 2. Modelagem de Dados (Supabase/PostgreSQL)
Estrutura de tabelas sugerida para suportar essa arquitetura.

### Tabelas de Gestão e Usuários
- **`profiles`**: Estende o `auth.users` do Supabase.
  - `id` (uuid), `full_name`, `role` (enum: 'admin', 'formador', 'seminarista'), `stage_id` (fk), `avatar_url`.
- **`formative_stages`**:
  - `id`, `name` (Propedêutico, Filosofia I, etc.), `order`.

### Tabelas da Biblioteca
- **`books`**: `id`, `title`, `author`, `isbn`, `category`, `total_copies`.
- **`loans`**:
  - `id`, `book_id` (fk), `user_id` (fk), `loan_date`, `due_date`, `return_date`, `status` (enum: 'borrowed', 'returned', 'overdue').

### Tabelas Acadêmicas
- **`courses`**: `id`, `name` (Filosofia, Teologia).
- **`subjects`**: `id`, `course_id` (fk), `name`, `credits`, `prerequisite_id` (fk self-referencing).
- **`classes` (Turmas)**: `id`, `subject_id` (fk), `teacher_id` (fk de profiles), `semester` (ex: 2026.1).
- **`enrollments` (Matrículas/Notas)**:
  - `id`, `class_id` (fk), `student_id` (fk), `final_grade`, `status` (Aprovado, Reprovado, Cursando).

---

## 3. Arquitetura do Projeto (React + Tailwind)
Estrutura baseada em funcionalidades (**Feature-Based Folder Structure**) para facilitar a localização de contexto.

```text
src/
├── components/       # Componentes globais (Button, Input, Card) via Shadcn/UI
├── features/         # Lógica de negócio por módulo
│   ├── auth/         # Login e Proteção de Rotas
│   ├── library/      # Components e Hooks da Biblioteca
│   ├── academic/     # Lógica de notas e disciplinas
│   └── users/        # Gestão de seminaristas e perfis
├── hooks/            # Hooks globais (useSupabase, useUser)
├── lib/              # Configuração do Supabase Client
├── types/            # Definições do TypeScript (geradas via Supabase CLI)
└── utils/            # Funções utilitárias
```

### Stack Recomendada
- **Framework**: Vite + React + TypeScript.
- **UI**: Tailwind CSS + Shadcn/UI (visual clean e responsivo).
- **Gerenciamento de Estado**: React Query (TanStack Query) para cache dos dados do Supabase.
- **Ícones**: Lucide React.

---

## 4. Estratégia de Desenvolvimento (Prompting)
Para começar o desenvolvimento, utilize o seguinte prompt:

> "Estou criando um sistema de gestão para um seminário usando React, Tailwind e Supabase. Quero começar pelo MVP (v1.0).
>
> Configure a estrutura de pastas seguindo 'Feature-Based'.
>
> Use Shadcn/UI para criar um layout responsivo com uma Sidebar para Desktop e Bottom Navigation para Mobile (foco em mobile-first).
>
> Implemente a autenticação integrada ao Supabase.
>
> Crie a tela de 'Gestão de Seminaristas' com um CRUD simples consumindo a tabela 'profiles'."