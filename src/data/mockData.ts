import { ListingItem } from '../types';

export const INITIAL_ITEMS: ListingItem[] = [
  {
    id: 'item-1',
    title: 'Campbell Biology 12th Global Edition',
    category: 'books',
    price: 1850,
    exchangeType: 'Sell',
    condition: 'Like New',
    description: 'Essential textbook for BIO 101/102. Highlighted in only two chapters, binding and access codes intact. Happy to trade for Organic Chemistry Wade 9th ed.',
    campusLocation: 'Science Quad & Central Library',
    department: 'Biological Sciences',
    courseCode: 'BIO101',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&q=80&w=1000'
    ],
    seller: {
      id: 'seller-1',
      name: 'Maya Lin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      major: 'Molecular Biology',
      year: 'Junior (3rd Year)',
      rating: 4.9,
      tradesCompleted: 14,
      verifiedStudent: true
    },
    postedDate: '2 hours ago',
    isAvailable: true,
    interestedTradeFor: 'Organic Chemistry Wade or Physics Vol 2',
    tags: ['Biology', 'Textbook', 'Pre-Med', 'BIO101']
  },
  {
    id: 'item-2',
    title: 'Binocular Biological Compound Microscope (1000x)',
    category: 'lab',
    price: 0,
    exchangeType: 'Trade',
    condition: 'Good',
    description: 'Perfect optical clarity, dual LED illumination, with 4x, 10x, 40x, 100x oil immersion objectives. Looking to exchange for an iPad stylus or graphing calculator.',
    campusLocation: 'Biotech Lab Hub / Room 304',
    department: 'Bioengineering',
    courseCode: 'BIOENG210',
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000'
    ],
    seller: {
      id: 'seller-2',
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      major: 'Biomedical Engineering',
      year: 'Senior (4th Year)',
      rating: 5.0,
      tradesCompleted: 22,
      verifiedStudent: true
    },
    postedDate: 'Yesterday',
    isAvailable: true,
    interestedTradeFor: 'Apple Pencil 2 or TI-Nspire CX II',
    tags: ['Lab Equipment', 'Microscope', 'Optics', 'Research']
  },
  {
    id: 'item-3',
    title: 'Dell UltraSharp 27" 4K USB-C Monitor (U2720Q)',
    category: 'electronics',
    price: 14500,
    exchangeType: 'Sell',
    condition: 'Like New',
    description: 'Single cable USB-C charging up to 90W for your laptop. Perfect color accuracy for design/coding coursework. Comes with stand, HDMI, and USB-C cable.',
    campusLocation: 'North Dormitory Tower B',
    department: 'Computer Science',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=1000'
    ],
    seller: {
      id: 'seller-3',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      major: 'Computer Science & AI',
      year: 'Grad Student',
      rating: 4.8,
      tradesCompleted: 9,
      verifiedStudent: true
    },
    postedDate: '3 days ago',
    isAvailable: true,
    tags: ['4K Monitor', 'USB-C', 'Workstation', 'Setup']
  },
  {
    id: 'item-4',
    title: 'Ergonomic Mesh Study Chair with Lumbar Support',
    category: 'furniture',
    price: 0,
    exchangeType: 'Giveaway',
    condition: 'Good',
    description: 'Moving out of campus residence this weekend. Fully functional adjustable tilt and armrests. Free to whoever can pick it up from West Commons.',
    campusLocation: 'West Commons Hall Lounge',
    department: 'General Campus',
    images: [
      'https://images.unsplash.com/photo-1580481077195-c3a82104e382?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=1000'
    ],
    seller: {
      id: 'seller-4',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      major: 'Architecture',
      year: 'Senior (4th Year)',
      rating: 4.7,
      tradesCompleted: 7,
      verifiedStudent: true
    },
    postedDate: '5 hours ago',
    isAvailable: true,
    tags: ['Dorm Furniture', 'Free', 'Moving Sale', 'Desk Chair']
  },
  {
    id: 'item-5',
    title: 'Digital Oscilloscope Rigol DS1054Z 50MHz 4-Channel',
    category: 'lab',
    price: 15800,
    exchangeType: 'Sell',
    condition: 'Brand New',
    description: 'Purchased for senior robotics capstone project. In original box with 4 passive probes and calibration certificate. Ideal for EE, Mechatronics, and IoT labs.',
    campusLocation: 'MakerSpace Innovation Wing',
    department: 'Electrical Engineering',
    courseCode: 'EE240',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000'
    ],
    seller: {
      id: 'seller-5',
      name: 'Aiden Patel',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
      major: 'Robotics & Mechatronics',
      year: 'Junior (3rd Year)',
      rating: 5.0,
      tradesCompleted: 18,
      verifiedStudent: true
    },
    postedDate: '4 days ago',
    isAvailable: true,
    tags: ['Electronics Lab', 'Oscilloscope', 'Circuits', 'Robotics']
  },
  {
    id: 'item-6',
    title: 'TI-84 Plus CE Color Graphing Calculator',
    category: 'electronics',
    price: 4200,
    exchangeType: 'Sell',
    condition: 'Like New',
    description: 'Rechargeable battery, python edition. Loaded with Calculus programs and chemistry periodic table. Includes slide cover and charging cable.',
    campusLocation: 'Student Union Food Court',
    department: 'Mathematics',
    courseCode: 'MATH151',
    images: [
      'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&q=80&w=1000'
    ],
    seller: {
      id: 'seller-6',
      name: 'Sarah Kim',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      major: 'Data Science',
      year: 'Sophomore (2nd Year)',
      rating: 4.9,
      tradesCompleted: 11,
      verifiedStudent: true
    },
    postedDate: '1 day ago',
    isAvailable: true,
    tags: ['Calculator', 'Math', 'Calculus', 'Stats']
  },
  {
    id: 'item-7',
    title: 'Adjustable Standing Desk Converter (Dual Tier)',
    category: 'furniture',
    price: 3500,
    exchangeType: 'Trade',
    condition: 'Good',
    description: 'Gas spring scissor lift mechanism fits two monitors and full keyboard tray. Can trade for coffee table or dorm mini-fridge.',
    campusLocation: 'Grad Student Housing Quad C',
    department: 'General Campus',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1000'
    ],
    seller: {
      id: 'seller-7',
      name: 'Liam O\'Connor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      major: 'Economics',
      year: 'Senior (4th Year)',
      rating: 4.6,
      tradesCompleted: 6,
      verifiedStudent: true
    },
    postedDate: '6 days ago',
    isAvailable: true,
    interestedTradeFor: 'Mini Fridge or Bookshelf',
    tags: ['Desk', 'Ergonomic', 'Study', 'Standing Desk']
  },
  {
    id: 'item-8',
    title: 'Organic Chemistry Model Kit (240 Pieces)',
    category: 'lab',
    price: 1150,
    exchangeType: 'Sell',
    condition: 'Like New',
    description: 'Complete molecular model set with atom parts and bond links. Indispensable for stereochemistry and 3D isomer visualization.',
    campusLocation: 'Chemistry Annex / Room 112',
    department: 'Chemistry',
    courseCode: 'CHEM221',
    images: [
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1000'
    ],
    seller: {
      id: 'seller-1',
      name: 'Maya Lin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      major: 'Molecular Biology',
      year: 'Junior (3rd Year)',
      rating: 4.9,
      tradesCompleted: 14,
      verifiedStudent: true
    },
    postedDate: '1 week ago',
    isAvailable: true,
    tags: ['Chemistry', 'Molecular Model', 'Orgo', 'CHEM221']
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Campus Items', icon: 'Sparkles', count: 8 },
  { id: 'books', name: 'Textbooks & Notes', icon: 'BookOpen', count: 2 },
  { id: 'electronics', name: 'Electronics & Tech', icon: 'Laptop', count: 2 },
  { id: 'furniture', name: 'Dorm & Furniture', icon: 'Armchair', count: 2 },
  { id: 'lab', name: 'Lab & Science Gear', icon: 'FlaskConical', count: 2 }
];
