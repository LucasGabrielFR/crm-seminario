# Plano de Ação - Vocare CRM

## 1. Plano de Ação por Versões

### Versão 1.0 (MVP - O Core)
*Foco em tirar o processo do papel e centralizar as informações básicas.*

- **Auth & Permissões**: Login via Supabase Auth e níveis de acesso (Admin, Formador, Seminarista, Professor).
- **Gestão de Pessoas**: Cadastro de perfis com etapa formativa (Menor,Propedêutico, Filosofia, Teologia) e status (Ativo, Egresso, etc.).
- **Biblioteca Essencial**: Cadastro de livros e fluxo de empréstimo manual com status.
- **Dashboard Simples**: Resumo de quantos livros estão atrasados e total de seminaristas por etapa.

### Versão 1.1 (Acadêmico & Acervo Digital)
- **Módulo Acadêmico I**: Cadastro de disciplinas, cursos e turmas.
- **Portal do Professor**: Lançamento de notas finais e controle de presença.
- **Boletim do Aluno**: Visão exclusiva para o seminarista acompanhar seu progresso e notas.
- **Integração Google Drive**: Aba com iframe ou links diretos para pastas de materiais por disciplina.

### Versão 1.2 (Biblioteca Pró)
- **Scanner Mobile**: Implementação de leitura de código de barras (ISBN) via câmera para empréstimos rápidos.
- **Catálogo Inteligente**: Integração com API (Google Books/Open Library) para preenchimento automático de dados do livro.
- **Gestão de Reservas**: Fila de espera para livros populares.

### Versão 2.0 (Ecossistema Integrado)
- **Google Classroom**: Sincronização automática de materiais e avisos.
- **Módulo de Escalas**: Integração do sistema de escalas (Liturgia, Cozinha, Faxina) com notificações em tempo real.
- **Comunicação & Push**: Alertas de livros atrasados e avisos acadêmicos via Web Push ou E-mail.
- **PWA**: Transformar o sistema em um Progressive Web App para instalação direta no celular.

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
  - `id`, `class_id` (fk), `student_id` (fk), `final_grade`, `absences`, `status` (Aprovado, Reprovado, Cursando).

### Tabelas de Infraestrutura (Desejável)
- **`audit_logs`**: Rastreabilidade de quem alterou notas, status de usuários ou registros da biblioteca.
- **`documents`**: Metadados de arquivos enviados ao Storage (RG, CPF, Certidões).

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
- **State Management**: React Query (TanStack Query) + Context API para temas e auth.
- **Mobile**: Foco em UX mobile (Bottom Nav) + PWA.

---

## 4. Estratégia de Desenvolvimento (Prompting)

### Fase 1: Finalização do Core (v1.0)
> "Finalize o CRUD de usuários permitindo a edição de perfis e alteração de senha. Implemente o sistema de 'Etapas Formativas' garantindo que cada usuário esteja vinculado a uma (Propedêutico, Filosofia, etc)."

### Fase 2: Biblioteca & Scanner
> "Implemente o módulo de biblioteca. Crie a tabela 'books' e 'loans'. Adicione um componente de câmera que utilize a biblioteca 'react-qr-reader' ou similar para capturar ISBNs e buscar dados na API do Google Books."

### Fase 3: Acadêmico & Boletins
> "Crie o módulo acadêmico com lançamento de notas. Gere um PDF formatado (usando @react-pdf/renderer) para o boletim do aluno, contendo as médias e o status de aprovação."

---

## 5. Próximos Passos Imediatos
1. [x] Tema Dark/Light.
2. [ ] Implementar edição de perfil (Nome e Telefone).
3. [ ] Criar modal de troca de senha.
4. [ ] Iniciar estrutura das tabelas de Biblioteca no Supabase.
5. [ ] Desenvolver listagem inicial de livros.