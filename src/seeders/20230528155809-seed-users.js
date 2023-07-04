module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [
    {
      username: 'nicolasgarcia',
      password: 'nicolas123',
      mail: 'nicolas.garcia@uc.cl',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'diegoastudillo',
      password: 'diego123',
      mail: 'diego.astudillo@uc.cl',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
