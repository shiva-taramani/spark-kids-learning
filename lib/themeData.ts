export interface ThemePatient {
  id: string;
  name: string;
  species: string;
  icon: string;
  color: string;
  actionText: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  icon: string;
  tokenBaseIcon: string;
  tokenExtraIcon: string;
  tokenBaseLabel: string;
  tokenExtraLabel: string;
  statusAction: string;
  patients: ThemePatient[];
}

export const THEMES: Record<string, ThemeConfig> = {
  dino: {
    id: 'dino',
    name: 'Dino Rescue',
    icon: '🦕',
    tokenBaseIcon: '🥚',
    tokenExtraIcon: '🪺',
    tokenBaseLabel: 'Gold Eggs',
    tokenExtraLabel: 'Blue Eggs',
    statusAction: 'Clean mud to heal',
    patients: [
      { id: 'rexy', name: 'Rexy', species: 'Baby T-Rex', icon: '🦖', color: '#34d399', actionText: 'Wash Mud 🧼' },
      { id: 'trike', name: 'Trike', species: 'Triceratops', icon: '🦕', color: '#ffb703', actionText: 'Treat Horns 🩺' },
      { id: 'steggy', name: 'Steggy', species: 'Stegosaurus', icon: '🐊', color: '#fb7185', actionText: 'Brush Spines 🪮' },
    ]
  },
  sports: {
    id: 'sports',
    name: 'Sports League',
    icon: '⚽',
    tokenBaseIcon: '🏆',
    tokenExtraIcon: '🏀',
    tokenBaseLabel: 'Trophies',
    tokenExtraLabel: 'Baseballs',
    statusAction: 'Score points to polish',
    patients: [
      { id: 'hoops', name: 'Hoops', species: 'Basketball Champ', icon: '🏀', color: '#f97316', actionText: 'Polish Trophy ✨' },
      { id: 'striker', name: 'Striker', species: 'Soccer Star', icon: '⚽', color: '#38bdf8', actionText: 'Clean Cleats 👟' },
      { id: 'slugger', name: 'Slugger', species: 'Baseball Ace', icon: '⚾', color: '#a855f7', actionText: 'Fix Bat 🏏' },
    ]
  },
  legos: {
    id: 'legos',
    name: 'Lego Builders',
    icon: '🧱',
    tokenBaseIcon: '🧱',
    tokenExtraIcon: '🟨',
    tokenBaseLabel: 'Red Bricks',
    tokenExtraLabel: 'Yellow Studs',
    statusAction: 'Solve puzzles to build',
    patients: [
      { id: 'castle', name: 'King Castle', species: 'Lego Castle', icon: '🏰', color: '#eab308', actionText: 'Build Towers 🏰' },
      { id: 'rocket', name: 'Galaxy One', species: 'Lego Spaceship', icon: '🚀', color: '#ec4899', actionText: 'Snap Wings 🛩️' },
      { id: 'bot', name: 'Brick Bot', species: 'Toy Robot', icon: '🤖', color: '#06b6d4', actionText: 'Repair Gears ⚙️' },
    ]
  },
  construction: {
    id: 'construction',
    name: 'Construction Crew',
    icon: '🚜',
    tokenBaseIcon: '⚠️',
    tokenExtraIcon: '🪨',
    tokenBaseLabel: 'Cones',
    tokenExtraLabel: 'Rocks',
    statusAction: 'Complete jobs to clean',
    patients: [
      { id: 'diggy', name: 'Diggy', species: 'Excavator', icon: '🚜', color: '#f59e0b', actionText: 'Clean Tracks 🧼' },
      { id: 'dumper', name: 'Dumper', species: 'Dump Truck', icon: '🚚', color: '#10b981', actionText: 'Wash Bed 🚚' },
      { id: 'tower', name: 'Tower', species: 'Crane Rig', icon: '🏗️', color: '#6366f1', actionText: 'Oil Cable ⚙️' },
    ]
  }
};
