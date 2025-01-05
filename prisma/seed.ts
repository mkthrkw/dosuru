import bcrypt from "bcrypt";
import { prisma as prismaClient } from "./prisma";

async function main() {
  console.log("Seeding data...");

  // ユーザーを作成
  // パスワードをハッシュ化
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prismaClient.user.createMany({
    data: [
      { name: "User One", email: "userone@example.com", password: hashedPassword, image: null },
      { name: "User Two", email: "usertwo@example.com", password: hashedPassword, image: null },
    ],
  });

  const userRecords = await prismaClient.user.findMany();

  for (const user of userRecords) {
    console.log(`Creating projects for ${user.name}...`);

    // 各ユーザーに3つのプロジェクトを作成
    for (let projectIndex = 1; projectIndex <= 3; projectIndex++) {
      const project = await prismaClient.project.create({
        data: {
          name: `Project ${projectIndex} of ${user.name}`,
          description: `This is project ${projectIndex} for ${user.name}`,
          userId: user.id,
        },
      });

      console.log(`Creating lists for ${project.name}...`);

      // 各プロジェクトに4つのリストを作成
      for (let listIndex = 1; listIndex <= 4; listIndex++) {
        const list = await prismaClient.list.create({
          data: {
            title: `List ${listIndex} of ${project.name}`,
            color: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1"][listIndex - 1],
            projectId: project.id,
          },
        });

        console.log(`Creating tickets for ${list.title}...`);

        // 各リストに5つのチケットを作成
        for (let ticketIndex = 1; ticketIndex <= 5; ticketIndex++) {
          const ticket = await prismaClient.ticket.create({
            data: {
              title: `Ticket ${ticketIndex} of ${list.title}`,
              description: `Description for ticket ${ticketIndex} in ${list.title}`,
              startAt: ticketIndex % 2 === 0 ? new Date() : null,
              endAt: ticketIndex % 3 === 0 ? new Date() : null,
              listId: list.id,
            },
          });

          console.log(`Creating comments for ${ticket.title}...`);

          // 各チケットに2つのコメントを作成
          for (let commentIndex = 1; commentIndex <= 2; commentIndex++) {
            await prismaClient.comment.create({
              data: {
                text: `Comment ${commentIndex} for ${ticket.title}`,
                ticketId: ticket.id,
              },
            });
          }
        }
      }
    }
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
