import { Environment } from "./env.enum";

export const isTesting = () => process.env.NODE_ENV === Environment.Test;
