import { isTesting } from "../helpers";

export const DEFAULT_MYSQL_HOST = "localhost";
export const DEFAULT_MYSQL_PORT = 3306;
export const DEFAULT_MYSQL_USERNAME = "root";
export const DEFAULT_MYSQL_PASSWORD = "root";
export const DEFAULT_MYSQL_DB_NAME = isTesting() ? ":memory:" : "test";
