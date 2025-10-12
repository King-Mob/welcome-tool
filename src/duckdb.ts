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
    const getWelcome = `SELECT * FROM WelcomeMessages WHERE room_id = $1;`;
    const prepared = await connection.prepare(getWelcome);
    prepared.bindVarchar(1, roomId);
    const welcomeRows = await prepared.run();
    const welcomes = await welcomeRows.getRowObjects();
    return welcomes[0];
}

export async function insertWelcomeMessage(roomId: string, message: string) {
    const insertWelcome = `INSERT INTO WelcomeMessages VALUES ($1, $2);`;
    const prepared = await connection.prepare(insertWelcome);
    prepared.bindVarchar(1, roomId);
    prepared.bindVarchar(2, message);
    await prepared.run();
}

export async function updateWelcomeMessage(roomId: string, message: string) {
    const updateWelcome = `UPDATE WelcomeMessages SET message = $1 WHERE room_id = $2`;
    const prepared = await connection.prepare(updateWelcome);
    prepared.bindVarchar(1, message);
    prepared.bindVarchar(2, roomId);
    await prepared.run();
}

