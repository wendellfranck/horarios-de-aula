# horarios-de-aula


# 🏫 Sistema de Gestão - Escola do Chavito

> Sistema desenvolvido para ajudar o Professor Girafales na gestão de horários e salas da escola.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## 📋 Sobre o Projeto

O Professor Girafales se tornou o novo diretor da escola e precisa ter controle sobre:

- ⏰ **Quantidade de horas que cada professor tem comprometido em aulas**
- 📅 **Lista de salas com horários livres e ocupados** 
- ⚠️ **Detecção automática de conflitos de agendamento**

## 🎯 Funcionalidades

- [x] Cálculo de horas comprometidas por professor
- [x] Visualização de horários das salas por dia da semana
- [x] Detecção automática de conflitos de horário
- [x] Relatórios formatados e fáceis de ler
- [x] Suporte para diferentes bancos de dados (PostgreSQL, MySQL, SQLite)

## 🛠️ Tecnologias Utilizadas

- **TypeScript** - Linguagem principal
- **Node.js** - Runtime
- **PostgreSQL/MySQL/SQLite** - Banco de dados
- **Jest** - Testes unitários

## 🚀 Como Usar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Banco de dados (PostgreSQL, MySQL ou SQLite)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/horarios-de-aula.git

# Entre na pasta
cd horarios-de-aula

# Instale as dependências
npm install

# Configure o banco de dados (veja seção Configuração)

# Compile o projeto
npm run build

# Execute o sistema
npm start
```

### Desenvolvimento

```bash
# Rodar em modo desenvolvimento
npm run dev

# Executar com watch (recompila automaticamente)
npm run dev:watch

# Rodar testes
npm test

# Verificar formatação
npm run lint
```

## ⚙️ Configuração

### Configuração do Banco de Dados

Edite o arquivo `src/adapters/DatabaseAdapter.ts` para configurar sua conexão:

```typescript
// Para PostgreSQL
const db = new PostgreSQLAdapter({
  host: 'localhost',
  port: 5432,
  database: 'escola_chavito',
  user: 'seu_usuario',
  password: 'sua_senha'
});

// Para SQLite (desenvolvimento)
const db = new SQLiteAdapter('./escola_chavito.db');
```

### Modelo do Banco de Dados

O sistema segue este modelo ER:

```
DEPARTMENT -> PROFESSOR -> SUBJECT -> CLASS -> CLASS_SCHEDULE
                ↓              ↓         ↓
            TITLE          PREREQUISITES  ROOM <- BUILDING
```

## 📊 Exemplo de Uso

```typescript
import { RoomScheduleAnalyzer } from './src/services/RoomScheduleAnalyzer';
import { PostgreSQLAdapter } from './src/adapters/DatabaseAdapter';

const db = new PostgreSQLAdapter(config);
const analyzer = new RoomScheduleAnalyzer(db);

// Gerar relatório completo
await analyzer.generateReport();
```

## 📈 Exemplo de Saída

```
🏫 RELATÓRIO DA ESCOLA DO CHAVITO
==================================================
📅 20/09/2025 18:30:15

📊 HORAS COMPROMETIDAS POR PROFESSOR:
----------------------------------------
Professor Girafales: 25.5h
Dona Florinda: 18.0h
Seu Madruga: 12.5h

📅 HORÁRIOS DAS SALAS:
----------------------------------------
🏢 Sala 101 (Prédio Principal):
  Segunda-feira 08:00-10:00: Matemática - Professor Girafales
  Segunda-feira 14:00-16:00: História - Dona Florinda

⚠️ CONFLITOS DE HORÁRIO:
----------------------------------------
✅ Nenhum conflito encontrado!
```

## 🗂️ Estrutura do Projeto

```
horarios-de-aula/
├── src/
│   ├── types/
│   │   └── database.ts          # Interfaces TypeScript
│   ├── services/
│   │   └── RoomScheduleAnalyzer.ts  # Lógica principal
│   ├── adapters/
│   │   └── DatabaseAdapter.ts   # Conexões com banco
│   └── main.ts                  # Ponto de entrada
├── sql/                         # Queries SQL
├── tests/                       # Testes unitários
├── docs/                        # Documentação
└── examples/                    # Exemplos de uso
```

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

## 📚 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run build` | Compila o projeto TypeScript |
| `npm start` | Executa o projeto compilado |
| `npm run dev` | Executa em modo desenvolvimento |
| `npm run dev:watch` | Executa com watch mode |
| `npm test` | Executa os testes |
| `npm run lint` | Verifica formatação do código |

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Queries SQL Principais

### Horas por Professor
```sql
SELECT 
    p.id AS professor_id,
    p.name AS professor_name,
    SUM(EXTRACT(EPOCH FROM (cs.end_time::time - cs.start_time::time))/3600) AS total_hours
FROM Professor p
JOIN Subject s ON s.id = ANY(p.subject_ids)
JOIN Class c ON c.subject_id = s.id
JOIN ClassSchedule cs ON cs.class_id = c.id
GROUP BY p.id, p.name
ORDER BY total_hours DESC;
```

### Conflitos de Horário
```sql
SELECT r.name, cs1.day_of_week, cs1.start_time, cs1.end_time,
       s1.name AS subject1, s2.name AS subject2
FROM Room r
JOIN ClassSchedule cs1 ON r.id = cs1.room_id
JOIN ClassSchedule cs2 ON r.id = cs2.room_id 
WHERE cs1.day_of_week = cs2.day_of_week
  AND cs1.start_time < cs2.end_time 
  AND cs1.end_time > cs2.start_time
  AND cs1.id < cs2.id;
```

## 🐛 Problemas Conhecidos

- [ ] Relacionamento Professor-Subject precisa ser definido no banco
- [ ] Campos de tempo podem variar entre PostgreSQL e MySQL
- [ ] Mock data não reflete estrutura real do banco

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para ajudar o Professor Girafales na gestão da Escola do Chavito.

---

### 📞 Contato

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- Email: seu.email@exemplo.com

### 🙏 Agradecimentos

- Professor Girafales pela inspiração
- Turma do Chaves pelos momentos de diversão durante o desenvolvimento
