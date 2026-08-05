import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database via Prisma ORM...');

  const paths = [
    {
      id: 'math',
      title: '🧮 Math',
      icon: '🧮',
      targetAgeGroup: 'all',
      componentType: 'ten_frame',
      description: 'Singapore Math Ten-Frame place-value visual addition.',
    },
    {
      id: 'words',
      title: '🔤 Words',
      icon: '🔤',
      targetAgeGroup: 'all',
      componentType: 'phonics',
      description: 'Interactive CVC sight words and letter sound tiles.',
    },
    {
      id: 'circuits',
      title: '⚡ Circuits',
      icon: '⚡',
      targetAgeGroup: 'age8',
      componentType: 'circuits',
      description: 'AA battery electronics, red (+) & black (-) wire safety, switches, and LEDs.',
    },
    {
      id: 'astronomy',
      title: '🚀 Space',
      icon: '🚀',
      targetAgeGroup: 'age8',
      componentType: 'generic_quiz',
      description: 'Planets, Solar System orbits, gravity, and rocket science.',
    },
    {
      id: 'robotics',
      title: '🤖 Coding',
      icon: '🤖',
      targetAgeGroup: 'age8',
      componentType: 'generic_quiz',
      description: 'Sequential algorithms, loops, and conditional if/else robot instructions.',
    },
  ];

  for (const path of paths) {
    await prisma.learningPath.upsert({
      where: { id: path.id },
      update: path,
      create: path,
    });
  }

  const modules = [
    {
      pathId: 'circuits',
      title: 'Lesson 1: Short Circuit Prevention',
      difficultyLevel: 1,
      config: {
        question: 'Why should red (+) and black (-) wires never touch directly without a light bulb or switch?',
        options: ['Causes a short circuit that heats the battery', 'Makes the room dark', 'Slows down time'],
        correctIdx: 0,
      },
    },
    {
      pathId: 'astronomy',
      title: 'Lesson 1: Planets of the Solar System',
      difficultyLevel: 1,
      config: {
        question: 'Which is the largest planet in our Solar System?',
        options: ['Jupiter 🪐', 'Mars 🔴', 'Earth 🌍', 'Mercury ⚪'],
        correctIdx: 0,
      },
    },
    {
      pathId: 'robotics',
      title: 'Lesson 1: What is a Repeat Loop?',
      difficultyLevel: 1,
      config: {
        question: 'What does a REPEAT 4 times loop do for a robot?',
        options: ['Executes the instruction 4 times in a row 🔄', 'Turns the robot off 🛑', 'Changes robot color 🎨'],
        correctIdx: 0,
      },
    },
  ];

  for (const mod of modules) {
    await prisma.learningModule.create({
      data: mod,
    });
  }

  console.log('✅ Database successfully seeded via Prisma ORM!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
