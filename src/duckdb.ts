import { DuckDBConnection, DuckDBInstance } from "@duckdb/node-api";

let connection: DuckDBConnection;

export async function startDuckDB() {
    const welcomeDuckDBFileName = "welcome_duckdb.db";

    const instance = await DuckDBInstance.create(welcomeDuckDBFileName);
    connection = await instance.connect();

    const tables = [
        {
            name: "WelcomeMessages",
            creationCommand:
                "CREATE TABLE WelcomeMessages (room_id VARCHAR, message VARCHAR);",
        }
    ]

    const existingTablesRows = await connection.run("SHOW TABLES;");
    const existingTables = await existingTablesRows.getRowObjects();

    tables.forEach(async (table) => {
        const tableExists = existingTables.filter((existingTable) => existingTable.name === table.name).length > 0;

        if (tableExists) {
            console.log(`${table.name} already exists`);
        } else {
            await connection.run(table.creationCommand);
            console.log(`${table.name} created`);
        }
    });
}

export async function getWelcomeMessageForRoomId(roomId: string) {
    const getWelcome = `SELECT * FROM WelcomeMessages WHERE room_id='${roomId}';`;
    const welcomeRows = await connection.run(getWelcome);
    const welcomes = await welcomeRows.getRowObjects();
    return welcomes[0];
}

export async function insertWelcomeMessage(roomId, message) {
    const insertWelcome = `INSERT INTO WelcomeMessages VALUES ('${roomId}', '${message}');`;
    await connection.run(insertWelcome);
}

export async function updateWelcomeMessage(roomId, message) {
    const updateWelcome = `UPDATE WelcomeMessages SET message='${message}' WHERE room_id='${roomId}';`;
    await connection.run(updateWelcome);
}