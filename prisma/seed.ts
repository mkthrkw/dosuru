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
          name: `Project ${projectIndex}`,
          description: `This is project ${projectIndex} for ${user.name}`,
          userId: user.id,
          order: projectIndex,
        },
      });

      console.log(`Creating lists for ${project.name}...`);

      // 各プロジェクトに4つのリストを作成
      let displayIdCount = 0;

      for (let listIndex = 1; listIndex <= 4; listIndex++) {
        const list = await prismaClient.list.create({
          data: {
            title: `List ${listIndex}`,
            color: ["#93aec1", "#9dbdba", "#f8b042", "#ec6a52"][listIndex - 1],
            projectId: project.id,
            order: listIndex,
          },
        });

        console.log(`Creating tickets for ${list.title}...`);

        // 各リストに5つのチケットを作成
        for (let ticketIndex = 1; ticketIndex <= 5; ticketIndex++) {
          const ticket = await prismaClient.ticket.create({
            data: {
              title: `Ticket ${displayIdCount}`,
              description: `Description for ticket ${ticketIndex} in ${list.title}`,
              startAt: displayIdCount % 2 === 0 ? new Date() : null,
              endAt: displayIdCount % 3 === 0 ? new Date() : null,
              listId: list.id,
              displayId: displayIdCount,
              order: ticketIndex,
            },
          });
          displayIdCount += 1;

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
