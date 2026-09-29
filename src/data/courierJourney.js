// Static Mock Data for 3D Courier Journey

export const LOCATIONS = {
  MERCHANT: {
    id: 'merchant',
    name: 'Merchant Facility',
    shortName: 'MERCHANT',
    position: [-20, 0, 2],
    type: 'building',
    address: 'Tejgaon Industrial Area, House 42',
    contact: 'Apex Electronics',
    phone: '+880 1711 000111',
    description: 'Seller dispatch warehouse and fulfillment center.'
  },
  ORIGIN_HUB: {
    id: 'origin-hub',
    name: 'Origin Hub (Central)',
    shortName: 'ORIGIN HUB',
    position: [-7, 0, -4],
    type: 'hub',
    address: 'Dhaka Logistics Park, Bay 12',
    contact: 'Hub Supervisor',
    capacity: '25,000 Parcels/Day',
    description: 'Primary sorting and regional consolidation hub.'
  },
  DESTINATION_HUB: {
    id: 'destination-hub',
    name: 'Destination Hub (South)',
    shortName: 'DESTINATION HUB',
    position: [7, 0, -4],
    type: 'hub',
    address: 'Dhanmondi Sector 4 Hub',
    contact: 'Local Dispatcher',
    capacity: '10,000 Parcels/Day',
    description: 'Local neighborhood distribution center.'
  },
  CUSTOMER: {
    id: 'customer',
    name: 'Customer Residence',
    shortName: 'CUSTOMER',
    position: [20, 0, 2],
    type: 'residence',
    address: 'Road 8A, House 15, Dhanmondi, Dhaka',
    contact: 'Imtiaz Ahmed',
    phone: '+880 1819 888999',
    description: 'Destination delivery address.'
  }
};

export const MOCK_PARCEL_INFO = {
  trackingId: 'TC-10284992',
  sku: 'PRD-LGT-8842',
  itemType: 'Standard Electronics',
  weight: '2.5 KG',
  dimensions: '30cm × 20cm × 15cm',
  origin: 'Dhaka Central Merchant',
  destination: 'Dhanmondi, Dhaka',
  estimatedDelivery: 'Today, 4:30 PM',
  carrier: 'Express Logistics 3D',
  price: '$12.50'
};

export const DELIVERY_STEPS = [
  {
    id: 'parcel-created',
    stepNumber: 1,
    title: 'Parcel Created',
    statusTag: 'READY FOR PICKUP',
    locationId: 'merchant',
    fromLocation: 'Merchant',
    toLocation: 'Origin Hub',
    progressValue: 0.0,
    icon: 'Package',
    description: 'Merchant has packed the order. Shipping label generated.',
    timestamp: '10:00 AM'
  },
  {
    id: 'reached-origin-hub',
    stepNumber: 2,
    title: 'Origin Hub',
    statusTag: 'ARRIVED AT HUB',
    locationId: 'origin-hub',
    fromLocation: 'Merchant',
    toLocation: 'Origin Hub',
    progressValue: 0.25,
    icon: 'Building2',
    description: 'Parcel arrived at Origin Sorting Hub. Barcode scanned.',
    timestamp: '11:15 AM'
  },
  {
    id: 'in-transit',
    stepNumber: 3,
    title: 'In Transit',
    statusTag: 'INTER-HUB HIGHWAY',
    locationId: null,
    fromLocation: 'Origin Hub',
    toLocation: 'Destination Hub',
    progressValue: 0.50,
    icon: 'Truck',
    description: 'Cargo truck carrying package across logistics network.',
    timestamp: '01:30 PM'
  },
  {
    id: 'reached-destination-hub',
    stepNumber: 4,
    title: 'Destination Hub',
    statusTag: 'SORTING COMPLETE',
    locationId: 'destination-hub',
    fromLocation: 'Destination Hub',
    toLocation: 'Customer',
    progressValue: 0.75,
    icon: 'Warehouse',
    description: 'Parcel reached local hub and assigned to last-mile rider.',
    timestamp: '03:00 PM'
  },
  {
    id: 'out-for-delivery',
    stepNumber: 5,
    title: 'Out for Delivery',
    statusTag: 'RIDER EN ROUTE',
    locationId: null,
    fromLocation: 'Destination Hub',
    toLocation: 'Customer',
    progressValue: 0.90,
    icon: 'Bike',
    description: 'Delivery rider is on the way to the customer location.',
    timestamp: '03:45 PM'
  },
  {
    id: 'delivered',
    stepNumber: 6,
    title: 'Delivered',
    statusTag: 'DELIVERY CONFIRMED',
    locationId: 'customer',
    fromLocation: 'Delivery Rider',
    toLocation: 'Customer',
    progressValue: 1.0,
    icon: 'CheckCircle2',
    description: 'Package successfully handed over to customer.',
    timestamp: '04:15 PM'
  }
];

export const RETURN_STEPS = [
  {
    id: 'return-requested',
    stepNumber: 1,
    title: 'Return Requested',
    statusTag: 'PICKUP SCHEDULED',
    locationId: 'customer',
    fromLocation: 'Customer',
    toLocation: 'Destination Hub',
    progressValue: 0.0,
    icon: 'RotateCcw',
    description: 'Customer initiated return. Courier assigned for reverse pickup.',
    timestamp: '05:00 PM'
  },
  {
    id: 'destination-hub',
    stepNumber: 2,
    title: 'Destination Hub',
    statusTag: 'RETURN RECEIVED',
    locationId: 'destination-hub',
    fromLocation: 'Customer',
    toLocation: 'Destination Hub',
    progressValue: 0.25,
    icon: 'Warehouse',
    description: 'Rider collected return package and brought it to local hub.',
    timestamp: '06:10 PM'
  },
  {
    id: 'origin-warehouse',
    stepNumber: 3,
    title: 'Origin Warehouse',
    statusTag: 'REVERSE TRANSIT',
    locationId: 'origin-hub',
    fromLocation: 'Destination Hub',
    toLocation: 'Origin Warehouse',
    progressValue: 0.60,
    icon: 'Truck',
    description: 'Package in transit back to main central distribution warehouse.',
    timestamp: '08:00 PM'
  },
  {
    id: 'return-rider-assigned',
    stepNumber: 4,
    title: 'Return Rider',
    statusTag: 'SELLER HANDOVER EN ROUTE',
    locationId: null,
    fromLocation: 'Origin Warehouse',
    toLocation: 'Merchant',
    progressValue: 0.85,
    icon: 'Bike',
    description: 'Return courier transporting package for final seller handover.',
    timestamp: '09:30 PM'
  },
  {
    id: 'merchant-handover',
    stepNumber: 5,
    title: 'Merchant Handover',
    statusTag: 'RETURN COMPLETED',
    locationId: 'merchant',
    fromLocation: 'Return Rider',
    toLocation: 'Merchant',
    progressValue: 1.0,
    icon: 'CheckCircle2',
    description: 'Package delivered back to Merchant. Inventory restocked.',
    timestamp: '10:15 PM'
  }
];

export const CAMERA_VIEWS = {
  OVERVIEW: { id: 'OVERVIEW', label: 'Overview', position: [0, 22, 34], target: [0, 0, 0] },
  MERCHANT: { id: 'MERCHANT', label: 'Merchant', position: [-20, 8, 12], target: [-20, 0, 2] },
  ORIGIN_HUB: { id: 'ORIGIN_HUB', label: 'Origin Hub', position: [-7, 9, 7], target: [-7, 0, -4] },
  DESTINATION_HUB: { id: 'DESTINATION_HUB', label: 'Dest Hub', position: [7, 9, 7], target: [7, 0, -4] },
  CUSTOMER: { id: 'CUSTOMER', label: 'Customer', position: [20, 8, 12], target: [20, 0, 2] },
  FOLLOW: { id: 'FOLLOW', label: 'Follow Parcel', position: null, target: null }
};
