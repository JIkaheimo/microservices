import {
  Connection,
  createConnection,
  getConnection as getConnectionTypeorm,
} from "typeorm";
import { BaseConnectionOptions } from "typeorm/connection/BaseConnectionOptions";

interface TestDatabaseConfig {
  entities?: BaseConnectionOptions["entities"];
  useExisting?: boolean;
}

/**
 *
 */
export const useTestDatabase = (config?: TestDatabaseConfig) => {
  const { useExisting = false, entities = [] } = config ?? {};
  let connection: Connection;

  beforeAll(async () => {
    if (useExisting) {
      connection = getConnectionTypeorm();
    } else {
      connection = await createConnection({
        entities,
        type: "better-sqlite3",
        database: "testing",
        logging: false,
      });
    }
  });

  // Make sure the database tables are synchronized before each test.
  beforeEach(async () => {
    await connection.synchronize();
  });

  // Clear the database to avoid side-effects.
  afterEach(async () => {
    await connection.dropDatabase();
  });

  // Make sure the database connection gets closed gracefully.
  afterAll(async () => {
    if (!connection.isConnected) return;
    await connection.close();
  });

  const getConnection = () => {
    if (!connection) throw "Database connection uninitialized!";
    return connection;
  };

  return {
    getConnection,
    getRepository: (entity) => getConnection().getRepository<any>(entity),
  };
};
