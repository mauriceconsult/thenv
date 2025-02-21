// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();
async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "News" },
        { name: "Technology Trends" },
        { name: "Social Media Insights" },
        { name: "Entertainment" },
        { name: "Opinion" },
        { name: "Essays" },
        { name: "Sports & Culture" },
      ],
    });
    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}
main();
