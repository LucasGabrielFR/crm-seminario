# Brainstorming: Módulo Acadêmico

Este documento detalha o planejamento estrutural e funcional do Módulo Acadêmico, focado em ser prático, funcional e sem excesso de complexidade.

## 1. Visão Geral e Casos de Uso
O objetivo central é gerenciar o lado educacional dos seminaristas. Precisamos de um fluxo onde a coordenação cria as estruturas de ensino (Cursos e Turmas), os professores lançam notas, e os alunos visualizam o desempenho e grade de horários.

## 2. Perfis e Funções (Quem faz o quê?)
- **Administrador / Formador (Coordenação Acadêmica)**
  - Cria e edita Cursos, Disciplinas e Turmas.
  - Cadastra Professores no quadro.
  - Vincula Seminaristas (Alunos) e Professores às Turmas.
  - Define os horários das aulas e a fórmula de cálculo das notas (N1 e N2).
- **Professor**
  - Acessa o "Portal do Professor".
  - Visualiza apenas as Turmas em que está alocado.
  - Lança Notas (N1 e N2) e Frequência dos seminaristas daquela turma.
- **Seminarista (Aluno)**
  - Acessa o "Boletim do Aluno".
  - Visualiza as disciplinas em que está matriculado, seus horários, professores correntes, e as notas já lançadas.

## 3. Entidades e Relacionamentos (Lógica de Negócio)
Para não criar complexidade excessiva, a hierarquia será direta:
1. **Gestão de Cursos:** Um Curso (ex: *Teologia*, *Filosofia*) possui várias Disciplinas.
2. **Quadro de Professores:** O sistema deve ter uma identificação clara de quem é professor (por exemplo, um perfil com a *role* de professor e dados de especialidade, caso necessário).
3. **Turmas Ativas (O coração do módulo):** 
   - Uma Turma é a junção de: `1 Disciplina` + `1 Professor` + `N Alunos` + `Semestre/Ano`.
   - Turmas precisam ter uma "Grade de Horário" (ex: *Segundas, 08:00 - 10:00* e *Quartas, 10:00 - 12:00*).
4. **Matrículas e Livro de Notas:** 
   - É a ponte entre o Aluno e a Turma. Onde as notas (N1, N2) e a frequência ficam anexadas.

## 4. Dinâmica de Notas (N1, N2 e Fórmula Configurável)
Como solicitou um sistema flexível para as notas com base em **N1 e N2**:
- **Tabela de Configurações Acadêmicas:** Podemos ter parâmetros globais (ou específicos por curso) definindo os **Pesos** de cada nota. 
  - Exemplo 1 (Média Simples): `N1 (peso 1) + N2 (peso 1) / 2`
  - Exemplo 2 (Média Ponderada): `N1 (peso 4) + N2 (peso 6) / 10`
- O cálculo da Média Final pode ser feito em tempo real no banco de dados (via Views/Functions do Postgres) ou no frontend na hora da exibição, facilitando caso a fórmula seja alterada no meio do caminho. Média alcançando o valor mínimo, o status do aluno passa para "Aprovado".

## 5. Estrutura de Telas (UX/UI Mapeada)
1. **Painel de Coordenação (Admin):**
   - **Menu Cursos:** Tabela estilo CRUD para os Cursos e suas Disciplinas.
   - **Menu Corpo Docente:** Gestão e cadastro do quadro de professores.
   - **Menu Turmas & Horários:** Criador dinâmico de Turmas. Terá selects para escolher Disciplina, Professor e definir os horários. Abaixo, uma ferramenta para mover os alunos matriculados para a turma.
2. **Grade de Horários:**
   - Visualização em formato de calendário semanal ou tabela diária interativa, filtrável por Curso ou Turma.
3. **Menu Professor (Diário de Classe):**
   - Dashboard que lista os "cards" das Turmas vigentes do educador. 
   - Ao clicar, abre a listagem de alunos da sala com inputs diretos na tabela para preencher N1 e N2. Botão "Salvar Notas".
4. **Menu Aluno (Boletim Acadêmico):**
   - Layout limpo em estilo tabela contendo: `Disciplina | Professor | N1 | N2 | Média Final | Status (Aprovado/Reprovado/Cursando)`.
   - Uma aba com a "Minha Grade" mostrando as aulas da semana dele.

## 6. Proposta de Arquitetura no Servidor (Supabase)
Esboço rápido de tabelas que suportariam isso de forma leve:
- `academic_settings`: `id`, `n1_weight`, `n2_weight`, `passing_grade` (nota mínima para passar).
- `courses`: `id`, `name`, `description`.
- `subjects`: `id`, `course_id`, `name`, `workload` (horas).
- `classes` (Turmas): `id`, `subject_id`, `teacher_id` (vinculado à tabela profiles), `semester` (ex: 2026.1).
- `class_schedules`: `id`, `class_id`, `day_of_week` (0 a 6), `start_time`, `end_time`.
- `enrollments` (Matrículas): `id`, `class_id`, `student_id`, `n1_grade`, `n2_grade`, `final_grade` (calculada ou armazenada), `absences`.

---
**Próximo Passo Recomendado:**
Se o fluxo acima fizer sentido, podemos começar implementando a tabela de "Cursos e Disciplinas", ou se preferir eu posso detalhar mais algum ponto específico, como a tela de visualização de horários ou a flexibilização das fórmulas. O que acha da estrutura?
