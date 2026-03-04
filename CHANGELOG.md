# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
