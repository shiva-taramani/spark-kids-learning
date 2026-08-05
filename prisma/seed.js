const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database via Prisma ORM...');

  // 1. Seed Core Learning Paths
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

  // Clear existing sample modules to avoid duplicates
  await prisma.learningModule.deleteMany({});

  // 2. Seed Rich Educational Lessons
  const modules = [
    // ⚡ Electric Circuits Lessons (Age 8)
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
      pathId: 'circuits',
      title: 'Lesson 2: Switches and Open Circuits',
      difficultyLevel: 1,
      config: {
        question: 'What happens when you flip a switch to OFF in a circuit?',
        options: ['It breaks the path so electricity stops flowing', 'It makes electricity flow faster', 'It changes the wire color'],
        correctIdx: 0,
      },
    },
    {
      pathId: 'circuits',
      title: 'Lesson 3: Conductors vs Insulators',
      difficultyLevel: 2,
      config: {
        question: 'Which material allows electricity to flow through a circuit safely?',
        options: ['Copper Wire 🪙', 'Rubber Eraser 🧼', 'Plastic Spoon 🥄'],
        correctIdx: 0,
      },
    },
    {
      pathId: 'circuits',
      title: 'Lesson 4: Batteries in Series',
      difficultyLevel: 2,
      config: {
        question: 'If one AA battery provides 1.5 Volts, what happens when you connect two 1.5V batteries in series?',
        options: ['Total voltage increases to 3.0 Volts ⚡', 'Total voltage drops to 0V', 'The batteries disappear'],
        correctIdx: 0,
      },
    },

    // 🚀 Astronomy & Space Lessons (Age 8)
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
      pathId: 'astronomy',
      title: 'Lesson 2: Gravity and Orbits',
      difficultyLevel: 2,
      config: {
        question: 'What force keeps the Earth orbiting around the Sun?',
        options: ['Sun Gravity ☀️', 'Wind 🌬️', 'Magnetism 🧲'],
        correctIdx: 0,
      },
    },
    {
      pathId: 'astronomy',
      title: 'Lesson 3: The Red Planet',
      difficultyLevel: 1,
      config: {
        question: 'Which planet is known as the "Red Planet" due to iron oxide rust on its surface?',
        options: ['Mars 🔴', 'Venus 🟡', 'Neptune 🔵'],
        correctIdx: 0,
      },
    },

    // 🤖 Coding & Robotics Lessons (Age 8)
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
    {
      pathId: 'robotics',
      title: 'Lesson 2: Conditional If/Else Logic',
      difficultyLevel: 2,
      config: {
        question: 'If IF (Obstacle Ahead) is TRUE, what should the robot do?',
        options: ['Turn around 🔄', 'Keep walking into wall 🧱', 'Power down 🔌'],
        correctIdx: 0,
      },
    },
  ];

  for (const mod of modules) {
    await prisma.learningModule.create({
      data: mod,
    });
  }

  console.log('✅ Database successfully cleaned and seeded via Prisma ORM!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
