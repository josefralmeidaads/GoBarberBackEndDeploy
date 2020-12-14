interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      name: string,
      email: string,
    },
  };
}
console.log(process.env.MAIL_DRIVER);
export default {
  driver: process.env.MAIL_DRIVER,
  defaults: {
    from: {
      name: 'Equipe Central Barber',
      email: 'josefrancisco@centralprojects.com.br',
    }
  }
} as IMailConfig;