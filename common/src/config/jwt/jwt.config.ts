import { registerAs } from "@nestjs/config";
import { DEFAULT_JWT_SECRET } from "./defaults";
import { JwtConfig } from "./jwt.interface";

export const jwtConfig = registerAs(
  "jwt",
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET ?? DEFAULT_JWT_SECRET,
  })
);
