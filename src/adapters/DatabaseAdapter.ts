// src/adapters/DatabaseAdapter.ts

import { DatabaseConnection } from '../types/database';
import * as sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';

export class SQLiteAdapter implements DatabaseConnection {
  private db: Database;

  constructor(dbPath: string) {
    this.db = new sqlite3.Database(dbPath);
  }

  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as T[]);
        }
      });
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

//dados teste
export class MockDatabaseAdapter implements DatabaseConnection {
  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    console.log('Query executada:', sql.split('\n')[1]?.trim() || 'Query SQL');
    
    // Simular horas dos professores
    if (sql.includes('professor_id') && sql.includes('total_hours')) {
      return [
        { professor_id: 1, professor_name: 'Professor Girafales', total_hours: '25.5' },
        { professor_id: 2, professor_name: 'Dona Florinda', total_hours: '18.0' },
        { professor_id: 3, professor_name: 'Seu Madruga', total_hours: '12.5' },
        { professor_id: 4, professor_name: 'Dona Clotilde', total_hours: '0.0' }
      ] as T[];
    }
    
    // Simular horários das salas
    if (sql.includes('room_id') && sql.includes('building_name')) {
      return [
        {
          room_id: 1, room_name: 'Sala 101', building_name: 'Prédio Principal',
          day_of_week: 'Segunda-feira', start_time: '08:00', end_time: '10:00',
          subject_name: 'Matemática', subject_code: 'MAT001',
          professor_name: 'Professor Girafales', class_code: 'MAT001-2024-1'
        },
        {
          room_id: 1, room_name: 'Sala 101', building_name: 'Prédio Principal',
          day_of_week: 'Segunda-feira', start_time: '14:00', end_time: '16:00',
          subject_name: 'História', subject_code: 'HIS001',
          professor_name: 'Dona Florinda', class_code: 'HIS001-2024-1'
        },
        {
          room_id: 2, room_name: 'Sala 102', building_name: 'Prédio Principal',
          day_of_week: 'Terça-feira', start_time: '10:00', end_time: '12:00',
          subject_name: 'Filosofia', subject_code: 'FIL001',
          professor_name: 'Seu Madruga', class_code: 'FIL001-2024-1'
        }
      ] as T[];
    }

    // Simular 
    if (sql.includes('cs1.id < cs2.id')) {
      return [] as T[];
    }

    return [] as T[];
  }
}