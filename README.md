# horarios-de-aula


# 🏫 Sistema de Gestão - Escola do Chavito

> Sistema desenvolvido para ajudar o Professor Girafales na gestão de horários e salas da escola.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## 📋 Sobre o Projeto

- ⏰ **Quantidade de horas que cada professor tem comprometido em aulas**
- 📅 **Lista de salas com horários livres e ocupados** 

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
git clone https://github.com/wendellfranck/horarios-de-aula.git

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


## 📚 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run build` | Compila o projeto TypeScript |
| `npm start` | Executa o projeto compilado |
| `npm run dev` | Executa em modo desenvolvimento |
| `npm run dev:watch` | Executa com watch mode |
| `npm test` | Executa os testes |
| `npm run lint` | Verifica formatação do código |



## 📝 Queries SQL 

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

### Lista de salas com horarios ocupados
```sql
 SELECT 
  r.id AS room_id,
  r.name AS room_name,
  b.name AS building_name,
  cs.day_of_week,
  cs.start_time,
  cs.end_time,
  s.name AS subject_name,
  s.code AS subject_code,
  p.name AS professor_name,
  c.code AS class_code
FROM Room r
JOIN Building b ON r.building_id = b.id
JOIN ClassSchedule cs ON cs.room_id = r.id
JOIN Class c ON cs.class_id = c.id
JOIN Subject s ON c.subject_id = s.id
JOIN Professor p ON s.id = ANY(p.subject_ids)
ORDER BY r.id, cs.day_of_week, cs.start_time;
```



