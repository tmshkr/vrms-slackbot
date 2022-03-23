import { Agenda } from "agenda/es";
export const agenda = new Agenda({ db: { address: process.env.MONGO_URI } });

agenda.define("sendCheckin", async (job) => {
  console.log(`sendCheckin ran at ${Date.now()}`);
});
