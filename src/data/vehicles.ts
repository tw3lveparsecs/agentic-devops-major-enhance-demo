import { Vehicle } from '../types';
import tieFighterImg from '@/assets/images/tie-fighter.svg';
import tieInterceptorImg from '@/assets/images/tie-interceptor.svg';
import tieBomberImg from '@/assets/images/tie-bomber.svg';
import imperialShuttleImg from '@/assets/images/imperial-shuttle.svg';
import atAtImg from '@/assets/images/at-at.svg';
import atStImg from '@/assets/images/at-st.svg';
import starDestroyerImg from '@/assets/images/star-destroyer.svg';
import victoryDestroyerImg from '@/assets/images/victory-destroyer.svg';

export const vehicles: Vehicle[] = [
  {
    id: 'tie-fighter',
    name: 'TIE Fighter',
    category: 'starfighter',
    manufacturer: 'Sienar Fleet Systems',
    price: 60000,
    image: tieFighterImg,
    specifications: {
      length: '6.4 meters',
      crew: '1 pilot',
      speed: '1,200 km/h',
      armament: ['Twin L-s1 laser cannons'],
      shielding: 'None',
      hyperdrive: 'None'
    },
    availability: 'in-stock',
    description: 'The backbone of the Imperial Navy, the TIE fighter is a fast and agile starfighter designed for space superiority missions.',
    classification: 'Starfighter',
    unitsInStock: 2847
  },
  {
    id: 'tie-interceptor',
    name: 'TIE Interceptor',
    category: 'starfighter',
    manufacturer: 'Sienar Fleet Systems',
    price: 85000,
    image: tieInterceptorImg,
    specifications: {
      length: '9.6 meters',
      crew: '1 pilot',
      speed: '1,250 km/h',
      armament: ['Four L-s9.3 laser cannons'],
      shielding: 'None',
      hyperdrive: 'None'
    },
    availability: 'in-stock',
    description: 'An advanced starfighter with enhanced speed and firepower, designed to counter Rebel Alliance fighters.',
    classification: 'Interceptor',
    unitsInStock: 1456
  },
  {
    id: 'tie-bomber',
    name: 'TIE Bomber',
    category: 'starfighter',
    manufacturer: 'Sienar Fleet Systems',
    price: 95000,
    image: tieBomberImg,
    specifications: {
      length: '7.8 meters',
      crew: '1 pilot',
      speed: '850 km/h',
      armament: ['Twin L-s1 laser cannons', 'Proton bombs', 'Concussion missiles'],
      shielding: 'None',
      hyperdrive: 'None'
    },
    availability: 'limited',
    description: 'Heavy assault starfighter designed for bombing runs against capital ships and ground installations.',
    classification: 'Bomber',
    unitsInStock: 387
  },
  {
    id: 'imperial-shuttle',
    name: 'Lambda-class Imperial Shuttle',
    category: 'transport',
    manufacturer: 'Sienar Fleet Systems',
    price: 240000,
    image: imperialShuttleImg,
    specifications: {
      length: '20 meters',
      crew: '6 (2 pilots, 4 crew)',
      speed: '850 km/h',
      armament: ['Twin L-s1 laser cannons', 'Twin AG-2G quad laser cannons'],
      shielding: 'Deflector shields',
      hyperdrive: 'Class 1'
    },
    availability: 'in-stock',
    description: 'Multi-purpose transport vessel used for ferrying personnel and cargo across the galaxy.',
    classification: 'Transport',
    unitsInStock: 734
  },
  {
    id: 'at-at',
    name: 'AT-AT Walker',
    category: 'support',
    manufacturer: 'Kuat Drive Yards',
    price: 1200000,
    image: atAtImg,
    specifications: {
      length: '20 meters',
      crew: '5 (commander, pilot, gunner, 2 crew)',
      speed: '60 km/h',
      armament: ['Heavy laser cannons', 'Medium blaster cannons'],
      shielding: 'Heavy armor plating',
      hyperdrive: 'N/A'
    },
    availability: 'limited',
    description: 'All Terrain Armored Transport - the Empire\'s primary ground assault vehicle for planetary invasions.',
    classification: 'Ground Vehicle',
    unitsInStock: 89
  },
  {
    id: 'at-st',
    name: 'AT-ST Walker',
    category: 'support',
    manufacturer: 'Kuat Drive Yards',
    price: 180000,
    image: atStImg,
    specifications: {
      length: '8.6 meters',
      crew: '2 (pilot, gunner)',
      speed: '90 km/h',
      armament: ['Twin blaster cannons', 'Concussion grenade launcher'],
      shielding: 'Light armor plating',
      hyperdrive: 'N/A'
    },
    availability: 'in-stock',
    description: 'All Terrain Scout Transport - fast reconnaisance and patrol vehicle for Imperial ground forces.',
    classification: 'Ground Vehicle',
    unitsInStock: 512
  },
  {
    id: 'star-destroyer',
    name: 'Imperial-class Star Destroyer',
    category: 'capital-ship',
    manufacturer: 'Kuat Drive Yards',
    price: 145000000,
    image: starDestroyerImg,
    specifications: {
      length: '1,600 meters',
      crew: '37,085 (9,235 officers, 27,850 enlisted)',
      speed: '975 km/h',
      armament: ['60 turbolaser batteries', '60 ion cannons', '10 tractor beam projectors'],
      shielding: 'Deflector shields',
      hyperdrive: 'Class 2'
    },
    availability: 'limited',
    description: 'The backbone of the Imperial Navy - a massive warship designed to project Imperial power across the galaxy.',
    classification: 'Capital Ship',
    unitsInStock: 12
  },
  {
    id: 'victory-destroyer',
    name: 'Victory-class Star Destroyer',
    category: 'capital-ship',
    manufacturer: 'Rendili StarDrive',
    price: 85000000,
    image: victoryDestroyerImg,
    specifications: {
      length: '900 meters',
      crew: '5,200',
      speed: '800 km/h',
      armament: ['20 turbolaser batteries', '20 double turbolaser batteries', '10 ion cannons'],
      shielding: 'Deflector shields',
      hyperdrive: 'Class 1'
    },
    availability: 'in-stock',
    description: 'Older but reliable capital ship design, excellent for planetary assault and system patrol duties.',
    classification: 'Capital Ship',
    unitsInStock: 23
  }
];

export const categories = [
  { id: 'all', name: 'All Vehicles', count: vehicles.length },
  { id: 'starfighter', name: 'Starfighters', count: vehicles.filter(v => v.category === 'starfighter').length },
  { id: 'transport', name: 'Transports', count: vehicles.filter(v => v.category === 'transport').length },
  { id: 'capital-ship', name: 'Capital Ships', count: vehicles.filter(v => v.category === 'capital-ship').length },
  { id: 'support', name: 'Support Vehicles', count: vehicles.filter(v => v.category === 'support').length }
];

export const manufacturers = [
  'All Manufacturers',
  'Sienar Fleet Systems',
  'Kuat Drive Yards',
  'Rendili StarDrive'
];