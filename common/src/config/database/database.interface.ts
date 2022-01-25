export interface DatabaseConfig {
  type: "mysql" | "better-sqlite3";
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  dropSchema: boolean;
}
