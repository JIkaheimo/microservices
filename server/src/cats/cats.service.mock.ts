export const catMock = {
  age: 1,
  breed: 'Tabby',
  name: 'Viljo',
};

export const catsServiceMock = {
  findAll: async () => [catMock],
  create: async () => catMock,
  findOne: async () => catMock,
  update: async () => catMock,
  remove: async () => {
    return;
  },
};
