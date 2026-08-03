export interface Patient {
  id: string;
  name: string;
  species: string;
  icon: string;
  color: string;
}

export const PATIENTS: Patient[] = [
  { id: 'rexy', name: 'Rexy', species: 'Baby T-Rex', icon: '🦖', color: '#34d399' },
  { id: 'trike', name: 'Trike', species: 'Triceratops', icon: '🦕', color: '#ffb703' },
  { id: 'steggy', name: 'Steggy', species: 'Stegosaurus', icon: '🐊', color: '#fb7185' }
];
