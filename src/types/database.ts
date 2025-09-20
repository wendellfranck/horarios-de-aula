// Título do professor
interface Title {
  id: number;
  name: string;
}

// Departamento
interface Department {
  id: number;
  name: string;
  professors?: Professor[];
}

// Professor
interface Professor {
  id: number;
  name: string;
  departmentId: number;
  titleId: number;
  title?: Title;
  subjects?: Subject[];
}

// Prédio
interface Building {
  id: number;
  name: string;
  rooms?: Room[];
}

// Sala
interface Room {
  id: number;
  buildingId: number;
  building?: Building;
}

// Disciplina
interface Subject {
  id: number;
  code: string;
  name: string;
  professorIds?: number[];
  professors?: Professor[];
  prerequisites?: SubjectPrerequisite[];
}

// Pré-requisitos de disciplina
interface SubjectPrerequisite {
  id: number;
  subjectId: number;
  prerequisiteId: number;
  prerequisite?: Subject;
}

// Classe (turma)
interface Class {
  id: number;
  subjectId: number;
  year: number;
  semester: string;
  code: string;
  schedules?: ClassSchedule[];
}

// Horário de aula
interface ClassSchedule {
  id: number;
  classId: number;
  roomId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room?: Room;
  class?: Class;
}


export interface DatabaseConnection {
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  close?(): Promise<void>;
}