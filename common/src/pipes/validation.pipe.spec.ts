import { ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { IsEmail, IsString } from "class-validator";
import { ValidationPipe } from "./validation.pipe";

class SomeDto {
  @IsString()
  field1: string;

  @IsString()
  @IsEmail()
  field2: string;
}

const metadata: ArgumentMetadata = {
  type: "body",
  metatype: SomeDto,
  data: "",
};

describe("ValidationPipe", () => {
  const pipe = new ValidationPipe();

  it("should throw Bad Request Exception when the validation fails", async () => {
    const reject = expect(pipe.transform({ field1: 3 }, metadata)).rejects;
    await reject.toThrow(BadRequestException);
    await reject.toHaveProperty("response", {
      errors: {
        field2: ["Must be an email", "Must be a string"],
        field1: ["Must be a string"],
      },
    });
  });

  it("should return input when the validation succeeds", async () => {
    const input = {
      field1: "asd",
      field2: "test@test.com",
    };

    const output = await pipe.transform(input, metadata);
    expect(output).toEqual(input);
  });
});
