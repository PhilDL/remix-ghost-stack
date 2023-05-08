export const EmailProvider = {
  sendEmail: async (emailAddress: string, subject: string, body: string) => {
    console.log("emailProvider", emailAddress, subject, body);
  },
};
