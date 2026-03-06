# Vocare CRM

Um sistema moderno de gestão para seminários, focado em centralizar informações acadêmicas, de biblioteca e gestão de pessoas, com uma interface otimizada para dispositivos móveis e desktop.

### Configuração de Ambiente

Para rodar o projeto localmente, você precisa configurar as variáveis de ambiente do Supabase:

1.  Crie um arquivo chamado `.env` na raiz do projeto.
2.  Copie o conteúdo de `.env.example` para o seu `.env`.
3.  Preencha com o seu **URL do Supabase** e sua **Anon Key** (disponíveis no painel do Supabase em Project Settings > API).

### Execução Local

- **Frontend**: [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Gerenciamento de Estado**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Ícones**: [Lucide React](https://lucide.dev/)

## 🧩 Módulos do Sistema

O sistema foi desenhado em grandes blocos funcionais para atender todas as necessidades da instituição:

### 1. Gestão de Pessoas
Módulo destinado à criação e edição de perfis de membros (Administradores, Formadores, Professores e Seminaristas).
* **Funcionalidades:** Listagem de usuários, filtros com busca inteligente, exclusão segura e atribuição de funções secundárias (ex: Bibliotecário).
* **Segurança:** Apenas usuários com alta permissão conseguem gerenciar e promover novos membros.

### 2. Biblioteca Essencial
Ecossistema completo para gestão do acervo físico e acesso digital.
* **Funcionalidades:** 
  * Cadastro de livros com categorização múltipla.
  * Solicitação de empréstimos por alunos e aprovação por bibliotecários.
  * Biblioteca Virtual: Acesso a links seguros (Google Drive) com PDFs e e-books liberados para toda a instituição.
* **Acesso:** Qualquer usuário pode consultar o acervo físico e virtual, mas apenas os bibliotecários gerem fluxo de devolução e catalogação.

### 3. Módulo Acadêmico
O coração pedagógico da plataforma.
* **Para Administradores e Formadores:** Criação de Cursos, Matrizes Curriculares, Turmas e montagem da Grade de Horários Global (com detecção automática de choque de horário). Configuração da fórmula oficial de notas (Pesos e Média).
* **Para Professores:** Diário de Classe digital. Portal isolado para lançamento prático de Notas (N1, N2) e Frequências.
* **Para Alunos (Seminaristas):** Boletim em tempo real listando as disciplinas matriculadas, faltas, situação (Aprovado/Reprovado) e agenda semanal de aulas.
* **Impressão (PDF):** Relatórios desenhados com CSS `@media print` para exportar grades de horário em paisagem e modo claro com 100% de aproveitamento do papel.

### 4. Gerador de Escalas Inteligente
Um sistema autônomo para criação de escalas de serviço e atividades.
* **Base Independente:** Possui seu próprio cadastro de pessoas e funções, não dependendo da base de usuários principal do sistema.
* **Automação Inteligente:** Algoritmo que gera escalas automaticamente, priorizando a rotação máxima de membros e evitando que a mesma pessoa repita funções em curto prazo.
* **Alertas de Conflito:** Detecção visual instantânea caso uma pessoa seja escalada para duas funções no mesmo dia ou na mesma função dentro de uma mesma semana.
* **Impressão Otimizada:** Layout ultra-compacto desenhado especificamente para escalas, aproveitando cada centímetro do papel e garantindo legibilidade máxima.
* **Acesso:** Disponível para todos os usuários autenticados, permitindo colaboração na gestão das escalas institucionais.

## 🎭 Perfis e Permissões (RBAC)

O sistema conta com um controle de acesso focado na hierarquia institucional:

1. **Administrador (Admin):** Visão e controle absoluto. Pode editar dados e permissões de qualquer outro usuário, gerir cursos e configurar regras do sistema. É o único capaz de promover outros a "Admin".
2. **Formador:** Visão gerencial avançada. Cria turmas, visualiza todas as notas e tem poder sobre as atividades diárias do seminário. Não possui poder destrutivo administrativo (ex: não pode excluir admins).
3. **Professor:** Visão focada. Possui acesso dedicado exclusivamente para interagir com suas próprias turmas, lançando resultados e pautas.
4. **Seminarista (Aluno):** Visão de consumidor final. Pode visualizar o seu boletim, sua grade de aulas específica, e fazer uso do catálogo e solicitações da biblioteca.

* **Modificador Especial - Bibliotecário:** Qualquer perfil listado acima pode receber esta "chave secundária", que desbloqueia os controles do acervo e empréstimos na Biblioteca.

## 📂 Estrutura do Projeto

O projeto segue uma arquitetura baseada em funcionalidades (**Feature-Based Folder Structure**), o que facilita a escalabilidade e a manutenção.

```text
src/
├── components/       # Componentes globais e UI (Layout responsivo com Sidebar, Menus, Modais)
├── features/         # Lógica de negócio isolada verticalmente por módulo
│   ├── auth/         # Autenticação e telas de Login
│   ├── users/        # Dashboard de pessoas e lógica de Modais (Adicionar/Editar)
│   ├── library/      # Acervo, requisições de livros, empréstimos e biblioteca virtual
│   ├── academic/     # Portal do aluno, portal do professor, grade curricular, notas e horários
│   └── scales/       # Gerador de escalas automático, gestão de funções e pessoas de escala
├── hooks/            # Hooks customizados (Ex: useAuth fornecendo o RBAC em tempo real)
├── lib/              # Inicialização do banco de dados (Supabase Client)
├── types/            # Tipagens globais e Definições de esquema de Banco em TypeScript
└── utils/            # Funções puras 
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
