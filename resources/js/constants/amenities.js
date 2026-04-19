// Canonical amenities catalog used by ListProperty, EditListing, PropertyDetail,
// and the Properties listing filter modal. Groups are rendered in this order.
//
// A group has either:
//   - items: string[]                         (flat group — most categories)
//   - subgroups: [{ label, items: string[] }] (nested — used for Kitchen Features)

export const AMENITY_GROUPS = [
    {
        category: 'Interior Features',
        items: [
            'Spacious Bedrooms',
            'Bedroom on Main Floor',
            'Modern Bathrooms',
            'Whirlpool Bath',
            'Steam Shower',
            'Ensuite Bathroom(s)',
            'Walk-in Closets',
            'Custom Built In Closets',
            'Built-in Bookshelves or Cabinets',
            'High Ceilings',
            'Crown Molding',
            'Wainscoting',
            'Recessed Lighting',
            'Central Heating',
            'Central Air Conditioning',
            'Radiant Heated Floors',
            'Fireplace',
            'Skylights',
            'Ceiling Fans',
            'Hardwood Floors',
            'Carpeted Floors',
            'Tile Floors',
        ],
    },
    {
        category: 'Kitchen Features',
        subgroups: [
            {
                label: 'Appliances',
                items: [
                    'Stainless steel refrigerator',
                    'Gas or electric range/oven',
                    'Microwave with convection features',
                    'Dishwasher',
                    'Wine cooler or wine refrigerator',
                    'Built-in coffee machine',
                    'Double ovens',
                    'Double dishwashers',
                ],
            },
            {
                label: 'Cabinetry',
                items: [
                    'Custom-built cabinetry',
                    'Soft-close drawers and cabinets',
                    'Under-cabinet lighting',
                ],
            },
            {
                label: 'Countertops',
                items: [
                    'Granite countertops',
                    'Quartz countertops',
                    'Marble countertops',
                    'Butcher block island countertop',
                    'Stainless steel countertops',
                    'Concrete countertops',
                    'Solid surface countertops',
                ],
            },
            {
                label: 'Kitchen Islands',
                items: [
                    'Large center island with seating',
                    'Multi-level island with breakfast bar',
                    'Prep sink in the island',
                ],
            },
            {
                label: 'Appliance Upgrades',
                items: [
                    'Commercial-grade range/oven',
                    'Sub-Zero or high-end refrigerator',
                    'Stainless Steel Appliances',
                    'Warming drawer for food storage',
                ],
            },
            {
                label: 'Sinks and Faucets',
                items: [
                    'Apron-front farmhouse sink',
                    'Undermount sink',
                    'Pot-filler faucet above the stove',
                ],
            },
            {
                label: 'Entertainment and Seating',
                items: [
                    'Open concept kitchen with bar seating',
                    'Breakfast nook with built-in bench seating',
                ],
            },
        ],
    },
    {
        category: 'Outdoor Features',
        items: [
            'Low-Maintenance Landscaping',
            'Brick Construction',
            'Fenced Yard',
            'Outdoor Lighting',
            'Fruit Trees or Vegetable Garden',
            'Patio or Deck',
            'Garden Area',
            'Pet-friendly Features (e.g., Pet Door, Fenced Yard)',
            'Hot Tub or Jacuzzi',
            'Public Sewer',
            'Septic Tank',
            'Inground Sprinklers',
            'BBQ Area',
            'Landscaped Yard',
            'Swimming Pool',
            'Swingset or Tree House',
            'Tennis Court or Sports Court',
        ],
    },
    {
        category: 'Additional Rooms and Spaces',
        items: [
            'Additional Storage Space (Basement, Attic, etc.)',
            'Attic or Loft',
            'Balcony/Terrace',
            'Finished Basement',
            'Formal Dining Room',
            'Guest House or Mother-in-Law Suite',
            'Gym or Fitness Room',
            'Home Office or Study',
            'Laundry Room',
            'Media Room or Home Theater',
            'Mudroom or Entryway Bench',
            'Nursery',
            'Playroom or Recreation Room',
            'Unfinished Basement',
            'Wine Cellar',
            'Workshop or Hobby Room',
        ],
    },
    {
        category: 'Safety and Security Features',
        items: [
            'Carbon Monoxide Detectors',
            'Gated Community',
            'Security Doors',
            'Security System',
            'Smoke Detectors',
            'Surveillance Cameras',
        ],
    },
    {
        category: 'Energy Efficiency and Technology',
        items: [
            'Energy Star Appliances',
            'Energy-Efficient Windows',
            'Programmable Thermostat',
            'Smart Home Technology',
            'Solar Panels',
        ],
    },
    {
        category: 'Garage and Parking',
        items: [
            'Attached Garage',
            'Carport',
            'Detached Garage',
            'Driveway Parking',
            'RV or Boat Parking',
        ],
    },
    {
        category: 'Accessibility Features',
        items: [
            'Elevator',
            'Handicap Accessible Bathroom',
            'Single-Level Living',
            'Wheelchair Ramp',
        ],
    },
    {
        category: 'Location and Surroundings',
        items: [
            'Close to Parks or Recreational Facilities',
            'Nearby Schools',
            'Nearby Shopping Centers or Restaurants',
            'Private Driveway or Cul-de-sac Location',
            'Walking Distance to Houses of Worship',
            'Public Transportation Access',
            'Scenic Views',
            'Shopping and Dining Options',
            'Waterfront Property',
        ],
    },
    {
        category: 'Community Amenities',
        items: [
            'Clubhouse',
            'Playground',
            'Pool',
            'Sports Courts',
            'Tennis Courts',
            'Walking Trails',
        ],
    },
];

// Items for a group — handles both flat and nested groups.
export const groupItems = (group) =>
    group.items ?? group.subgroups?.flatMap((sg) => sg.items) ?? [];

// Flat list of all amenities (for validation / "all" checks).
export const AMENITY_FLAT = AMENITY_GROUPS.flatMap(groupItems);
