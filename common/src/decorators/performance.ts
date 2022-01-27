export function ExecutionTime(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    console.time(`${target.constructor.name}:${methodName}`);
    const result = await originalMethod.apply(this, args);
    console.timeEnd(`${target.constructor.name}:${methodName}`);
    return result;
  };

  return descriptor;
}
