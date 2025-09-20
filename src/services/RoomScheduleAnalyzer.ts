import { DatabaseConnection } from "../types/database";


export class RoomScheduleAnalyzer {
    private db: DatabaseConnection;

    constructor(database: DatabaseConnection) {
        this.db = database;  
    }
    //quantidade de horas que cada professor tem na grade
    async getProfessorHours() {
        const query = `
            SELECT
                p.id AS professor_id,
                p.name AS professor_name,
                SUM(EXTRACT(EPOCH FROM (cs.end_time::time - cs.start_time::time))/3600) AS total_hours
            FROM
                Professor p
            JOIN
                Subject s ON s.id = ANY(p.subject_ids)
            JOIN
                Class c ON c.subject_id = s.id
            JOIN
                ClassSchedule cs ON cs.class_id = c.id
            GROUP BY
                p.id, p.name
            ORDER BY
                total_hours DESC;`


            return await this.db.query(query);
    }

     //lista de salas com horarios ocupados
    async getRoomSchedules() {
        const query = `
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
        `;
    
        return await this.db.query(query);
    }


    async generateReport() {
        console.log(' RELATÓRIO DA ESCOLA DO CHAVITO');
        console.log('=' .repeat(50));
        console.log(` ${new Date().toLocaleString('pt-BR')}\n`);
    
        try {
            // 1. Horas dos professores
            console.log(' HORAS COMPROMETIDAS POR PROFESSOR:');
            console.log('-'.repeat(40));
            const professorHours = await this.getProfessorHours();
            
            professorHours.forEach((row: any) => {
            const hours = parseFloat(row.total_hours || 0).toFixed(1);
            console.log(`${row.professor_name}: ${hours}h`);
            });
    
            console.log('\n HORÁRIOS DAS SALAS:');
            console.log('-'.repeat(40));
            const roomSchedules = await this.getRoomSchedules();
            
            let currentRoom = '';
            roomSchedules.forEach((row: any) => {
            if (currentRoom !== row.room_name) {
                currentRoom = row.room_name;
                console.log(`\n ${row.room_name} (${row.building_name}):`);
            }
            console.log(`  ${row.day_of_week} ${row.start_time}-${row.end_time}: ${row.subject_name} - ${row.professor_name}`);
            });
    
            console.log('\n CONFLITOS DE HORÁRIO:');
            console.log('-'.repeat(40));
           
            
            
    
        } catch (error) {
            console.error('❌ Erro:', error);
        }
    }
    
}