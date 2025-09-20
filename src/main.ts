import { MockDatabaseAdapter } from "./adapters/DatabaseAdapter";
import { RoomScheduleAnalyzer } from "./services/RoomScheduleAnalyzer";

async function main() {

    console.log("Sistema da Escola Girafales");

    try {

        const database = new MockDatabaseAdapter();
        const analyzer = new RoomScheduleAnalyzer(database);

        await analyzer.generateReport();

        console.log('Sistema funcionando');

    }catch (error) {
        console.error('Erro na aplicação:',error);
    }
}

main().catch(console.error);