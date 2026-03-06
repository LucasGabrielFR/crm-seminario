# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-03-06

### Adicionado
- **Módulo Acadêmico**: Lançamento completo do sistema acadêmico para gestão de cursos, disciplinas, turmas e horários.
- **Gestão de Grade Curricular**: Administradores podem cadastrar cursos e vincular múltiplas disciplinas a eles.
- **Gestão de Turmas e Horários**: Criação de turmas com definição de semestre, professor e horários semanais parametrizáveis (dia da semana, início, término e sala).
- **Portal do Professor**: Visão dedicada para professores gerenciarem suas turmas, alunos matriculados, lançarem notas (N1, N2) e frequências.
- **Boletim do Aluno**: Visão individualizada para os seminaristas acompanharem suas notas, médias, aprovações, faltas e grade semanal.
- **Grade de Horários Global**: Nova visualização dinâmica e inteligente dos horários do seminário, filtrada por perfil (Admin vê todos com alertas de choque de horário, Professores e Alunos veem as suas respectivas agendas).
- **Exportação de PDF Inteligente**: Otimização nativa via CSS para geração de PDF dos relatórios e grades, que automaticamente ajusta a impressão para modo claro, oculta menus laterais inferiores e ajusta o layout para orientação Paisagem com 100% de aproveitamento de tela.
- **Configurações Acadêmicas**: Nova aba para Administradores definirem o peso das notas na composição da média final do estudante (ex: N1 com peso 4 e N2 com peso 6) e ajustarem a média mínima global para aprovação.

### Alterado
- **Controle de Acessos Acadêmico**: Lógica implementada para que apenas Administradores, Formadores e Professores acessem telas de criação de conteúdo. O menu `is_teacher` integrado do perfil agora é respeitado na navegação.
- **Cálculo de Notas em Tempo Real**: Os boletins dos alunos agora reagem instantaneamente e assincronamente a qualquer mudança global cadastrada nas configurações (ex: mudança do sistema de pesos das provas refletindo recalculada nas listas).

## [1.2.1] - 2026-03-04
- **Função de Bibliotecário**: Implementação de cargos específicos para gestão da biblioteca. Agora qualquer usuário pode ser promovido a Bibliotecário.
- **Sistema de Solicitações**: Usuários regulares agora podem solicitar empréstimos de livros através de uma nova interface de solicitações.
- **Fluxo de Aprovação**: Bibliotecários possuem uma aba exclusiva para gerenciar (aprovar/negar) solicitações de empréstimo.
- **Controle de Acesso (RBAC)**: Restrição de funcionalidades sensíveis (edição de livros, devolução manual, biblioteca virtual) apenas para Bibliotecários e Admins.
- **Aba de Solicitações**: Nova aba na biblioteca para que usuários acompanhem o status de seus pedidos (Aguardando, Aprovado/Para Retirada, Negado).
- **Atribuição de Papel**: Adicionada opção nos modais de usuário (Novo/Editar) para atribuir a função de bibliotecário.

### Alterado
- **hooks de Autenticação**: O hook `useAuth` agora retorna o perfil completo do usuário, incluindo o status `is_librarian`.
- **Segurança (RLS)**: Novas políticas de segurança no Supabase para proteger a tabela de solicitações e garantir que usuários vejam apenas seus dados.

## [1.2.0] - 2026-03-04

### Adicionado
- **Módulo de Biblioteca**: Lançamento completo do sistema de gestão de acervo físico e virtual.
- **Multicategorias**: Suporte para que um livro pertença a várias categorias simultaneamente, com interface de seleção múltipla.
- **Cadastro Dinâmico de Categorias**: Modal para criação de novas categorias com sistema de aviso inteligente contra duplicidade ou nomes semelhantes.
- **Gestão de Acervo**: Interface estilo galeria para visualização de livros com busca, filtros e indicadores de localização física (estante).
- **Controle de Empréstimos**: Fluxo para membros registrados e convidados externos, com cálculo automático de data de vencimento.
- **Biblioteca Virtual**: Integração com repositório Google Drive para acesso rápido a PDFs e E-books.
- **Edição de Livros**: Funcionalidade para editar metadados e categorias de livros existentes.

### Alterado
- **Lógica de Devolução**: Atualização automática da `available_quantity` e preenchimento da `return_date` no momento da entrega.
- **Banco de Dados**: Nova estrutura de tabela de junção (`book_category_junction`) para permitir relações muitos-para-muitos entre livros e categorias.

## [1.1.0] - 2026-03-04

### Adicionado
- **Gestão de Usuários (Admin)**: Implementado CRUD completo (Criar, Editar, Excluir) de membros através da Dashboard de Pessoas.
- **Senha via CPF**: Novos usuários agora têm o CPF (apenas números) como senha inicial padrão.
- **Gestão de Senhas**: Adicionado modal de alteração de senha acessível para todos os usuários logados.
- **Edge Function Segura**: Implementada função `admin-create-user` para gerenciar usuários via Service Role, permitindo que administradores criem/editem contas sem encerrar sua própria sessão.
- **Campos Adicionais**: CPF e E-mail adicionados à tabela de `profiles` para melhor rastreabilidade e exibição.

### Alterado
- **Interface de Gestão**: Tabela de pessoas aprimorada com busca por e-mail, ícones de ação (Editar/Excluir) e estados de carregamento.
- **Fluxo de Autenticação**: Melhoria no tratamento de erros de sessão e validação manual de JWT nas Edge Functions para contornar problemas de cache de token.

## [1.0.1] - 2026-03-04

### Adicionado
- **Tema Dark/Light**: Implementado sistema de troca de temas com persistência no LocalStorage.
- **Identidade Visual**: Atualizado o nome do app para **Vocare CRM** em toda a interface.
- **Versão no Footer**: Exibição da versão do sistema na sidebar.

### Alterado
- **Design Modernizado**: Reformulação total do layout utilizando Shadcn/UI Design System (variáveis HSL).
- **Melhoria de UI/UX**: Novos cards no Dashboard, tabela de pessoas redesenhada e tela de login com efeitos visuais.
- **Segurança**: Arquivo `.env` removido do Git e instruções de configuração adicionadas ao README.

## [1.0.0-alpha] - 2026-03-04

### Adicionado
- **Setup Inicial**: Projeto inicializado com Vite, React e TypeScript.
- **Configuração de Estilo**: Tailwind CSS configurado com design system baseado em Shadcn/UI (variáveis HSL e suporte a Dark Mode).
- **Integração Supabase**: Cliente configurado e hook `useAuth` implementado para gestão de sessão.
- **Banco de Dados**: 
  - Migrações para as tabelas `profiles` e `formative_stages`.
  - Configuração de políticas de segurança (RLS).
  - Inserção inicial das etapas formativas (Menor, Propedêutico, Filosofia, Teologia).
- **Layout**: Estrutura responsiva com Sidebar para Desktop e Bottom Navigation para Mobile.
- **Página de Login**: Interface de autenticação integrada ao Supabase Auth.
- **Gestão de Pessoas**: Página inicial de listagem de membros com busca e filtros por cargo/etapa.
- **Documentação**: Criados arquivos `README.md`, `action-plan.md` e `CHANGELOG.md`.

---
*Nota: Versão inicial de desenvolvimento.*
