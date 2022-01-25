import { Environment } from "./environment/env.enum";

export const isTesting = () => process.env.NODE_ENV === Environment.Test;
