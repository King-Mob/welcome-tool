import { DuckDBConnection, DuckDBInstance, timestampValue } from "@duckdb/node-api";

let connection: DuckDBConnection;

export async function startDuckDB() {
    const leaderboardDuckDBFileName = "leaderboard_duckdb.db";

    const instance = await DuckDBInstance.create(leaderboardDuckDBFileName);
    connection = await instance.connect();

    const tables = [
        {
            name: "Links",
            creationCommand:
                "CREATE TABLE Links (room_id VARCHAR, sender VARCHAR, link VARCHAR, timestamp TIMESTAMP);",
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

export async function getLinksForRoomId(roomId: string) {
    const getLinks = `SELECT * FROM Links WHERE room_id = $1;`;
    const prepared = await connection.prepare(getLinks);
    prepared.bindVarchar(1, roomId);
    const linksRows = await prepared.run();
    const links = await linksRows.getRowObjects();
    return links;
}

export async function insertLink(roomId: string, sender: string, link: string) {
    const insertLink = `INSERT INTO Links VALUES ($1, $2, $3, $4);`;
    const prepared = await connection.prepare(insertLink);
    prepared.bindVarchar(1, roomId);
    prepared.bindVarchar(2, sender);
    prepared.bindVarchar(3, link);
    const timestamp = timestampValue(BigInt(Math.floor(Date.now())))
    prepared.bindTimestamp(4,timestamp);
    await prepared.run();
}



