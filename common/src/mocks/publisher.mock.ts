export const publisherMock = {
  emit: jest
    .fn()
    .mockImplementation((subject: string, payload: any) => payload),
};
