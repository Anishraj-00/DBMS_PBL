// Realistic Preloaded Sample Data for Restaurant Table Occupancy Management System

export const INITIAL_TABLES = [
  {
    id: 1,
    tableNumber: 'T-01',
    capacity: 2,
    locationZone: 'MAIN_HALL',
    status: 'AVAILABLE',
    isActive: true,
    activeSessionId: null,
    activeCustomerName: null,
    activePartySize: null,
    occupiedSince: null
  },
  {
    id: 2,
    tableNumber: 'T-02',
    capacity: 2,
    locationZone: 'MAIN_HALL',
    status: 'OCCUPIED',
    isActive: true,
    activeSessionId: 101,
    activeCustomerName: 'Rahul Sharma',
    activePartySize: 2,
    occupiedSince: new Date(Date.now() - 42 * 60000).toISOString() // 42 mins ago
  },
  {
    id: 3,
    tableNumber: 'T-03',
    capacity: 4,
    locationZone: 'MAIN_HALL',
    status: 'AVAILABLE',
    isActive: true,
    activeSessionId: null,
    activeCustomerName: null,
    activePartySize: null,
    occupiedSince: null
  },
  {
    id: 4,
    tableNumber: 'T-04',
    capacity: 4,
    locationZone: 'MAIN_HALL',
    status: 'OCCUPIED',
    isActive: true,
    activeSessionId: 102,
    activeCustomerName: 'Priya Patel',
    activePartySize: 4,
    occupiedSince: new Date(Date.now() - 75 * 60000).toISOString() // 75 mins ago
  },
  {
    id: 5,
    tableNumber: 'T-05',
    capacity: 6,
    locationZone: 'MAIN_HALL',
    status: 'CLEANING',
    isActive: true,
    activeSessionId: null,
    activeCustomerName: null,
    activePartySize: null,
    occupiedSince: null
  },
  {
    id: 6,
    tableNumber: 'T-06',
    capacity: 8,
    locationZone: 'MAIN_HALL',
    status: 'AVAILABLE',
    isActive: true,
    activeSessionId: null,
    activeCustomerName: null,
    activePartySize: null,
    occupiedSince: null
  },
  {
    id: 7,
    tableNumber: 'P-01',
    capacity: 2,
    locationZone: 'PATIO',
    status: 'OCCUPIED',
    isActive: true,
    activeSessionId: 103,
    activeCustomerName: 'Aarav Sharma',
    activePartySize: 2,
    occupiedSince: new Date(Date.now() - 18 * 60000).toISOString() // 18 mins ago
  },
  {
    id: 8,
    tableNumber: 'P-02',
    capacity: 4,
    locationZone: 'PATIO',
    status: 'AVAILABLE',
    isActive: true,
    activeSessionId: null,
    activeCustomerName: null,
    activePartySize: null,
    occupiedSince: null
  },
  {
    id: 9,
    tableNumber: 'B-01',
    capacity: 2,
    locationZone: 'BALCONY',
    status: 'RESERVED',
    isActive: true,
    activeSessionId: null,
    activeCustomerName: 'Sneha Reddy',
    activePartySize: 2,
    occupiedSince: null
  },
  {
    id: 10,
    tableNumber: 'B-02',
    capacity: 4,
    locationZone: 'BALCONY',
    status: 'CLEANING',
    isActive: true,
    activeSessionId: null,
    activeCustomerName: null,
    activePartySize: null,
    occupiedSince: null
  },
  {
    id: 11,
    tableNumber: 'VIP-01',
    capacity: 6,
    locationZone: 'VIP',
    status: 'AVAILABLE',
    isActive: true,
    activeSessionId: null,
    activeCustomerName: null,
    activePartySize: null,
    occupiedSince: null
  },
  {
    id: 12,
    tableNumber: 'VIP-02',
    capacity: 10,
    locationZone: 'VIP',
    status: 'OCCUPIED',
    isActive: true,
    activeSessionId: 104,
    activeCustomerName: 'Vikram Malhotra',
    activePartySize: 8,
    occupiedSince: new Date(Date.now() - 95 * 60000).toISOString() // 95 mins ago
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 4,
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma.test@example.com',
    phoneNumber: '9000000101',
    address: '12 Lake View Road, Hyderabad',
    notes: 'Prefers quiet corner tables, high-tea',
    totalVisits: 8,
    createdAt: '2026-10-12T10:30:00Z'
  },
  {
    id: 1,
    fullName: 'Aarav Sharma',
    email: 'aarav@example.com',
    phoneNumber: '+91-9000000001',
    address: '12 Lake Road, Banjara Hills',
    notes: 'Anniversary celebration patron',
    totalVisits: 5,
    createdAt: '2026-10-15T14:15:00Z'
  },
  {
    id: 2,
    fullName: 'Priya Patel',
    email: 'priya.patel@workmail.com',
    phoneNumber: '+91-9812345678',
    address: '404 Green Valley, Jubilee Hills',
    notes: 'Strict vegetarian, prefers patio seating',
    totalVisits: 12,
    createdAt: '2026-10-18T11:00:00Z'
  },
  {
    id: 3,
    fullName: 'Sneha Reddy',
    email: 'sneha.reddy@techcorp.in',
    phoneNumber: '+91-9765432109',
    address: '7th Avenue, Madhapur',
    notes: 'Family dining with young children',
    totalVisits: 3,
    createdAt: '2026-10-22T18:45:00Z'
  },
  {
    id: 5,
    fullName: 'Amit Verma',
    email: 'amit.verma@financehub.com',
    phoneNumber: '+91-9988776655',
    address: 'Plot 22, Financial District',
    notes: 'Corporate client meetings & business lunches',
    totalVisits: 15,
    createdAt: '2026-10-25T13:20:00Z'
  },
  {
    id: 6,
    fullName: 'Vikram Malhotra',
    email: 'v.malhotra@enterprise.org',
    phoneNumber: '+91-9876501234',
    address: 'Penthouse 14, Hitec City',
    notes: 'VIP guest, orders reserve vintage wine',
    totalVisits: 20,
    createdAt: '2026-11-01T20:10:00Z'
  }
];

export const INITIAL_SESSIONS = [
  {
    id: 101,
    tableId: 2,
    tableNumber: 'T-02',
    customerId: 4,
    customerName: 'Rahul Sharma',
    customerPhone: '9000000101',
    partySize: 2,
    status: 'ACTIVE',
    allocationType: 'MANUAL',
    checkInTime: new Date(Date.now() - 42 * 60000).toISOString(),
    checkOutTime: null,
    diningDurationMinutes: null,
    staffName: 'John Waiter',
    notes: 'Birthday dinner'
  },
  {
    id: 102,
    tableId: 4,
    tableNumber: 'T-04',
    customerId: 2,
    customerName: 'Priya Patel',
    customerPhone: '+91-9812345678',
    partySize: 4,
    status: 'ACTIVE',
    allocationType: 'AUTOMATIC',
    checkInTime: new Date(Date.now() - 75 * 60000).toISOString(),
    checkOutTime: null,
    diningDurationMinutes: null,
    staffName: 'Sarah Server',
    notes: 'Family gathering'
  },
  {
    id: 103,
    tableId: 7,
    tableNumber: 'P-01',
    customerId: 1,
    customerName: 'Aarav Sharma',
    customerPhone: '+91-9000000001',
    partySize: 2,
    status: 'ACTIVE',
    allocationType: 'MANUAL',
    checkInTime: new Date(Date.now() - 18 * 60000).toISOString(),
    checkOutTime: null,
    diningDurationMinutes: null,
    staffName: 'John Waiter',
    notes: 'Patio coffee & snacks'
  },
  {
    id: 104,
    tableId: 12,
    tableNumber: 'VIP-02',
    customerId: 6,
    customerName: 'Vikram Malhotra',
    customerPhone: '+91-9876501234',
    partySize: 8,
    status: 'ACTIVE',
    allocationType: 'MANUAL',
    checkInTime: new Date(Date.now() - 95 * 60000).toISOString(),
    checkOutTime: null,
    diningDurationMinutes: null,
    staffName: 'Admin',
    notes: 'Corporate celebration'
  },
  {
    id: 99,
    tableId: 1,
    tableNumber: 'T-01',
    customerId: 5,
    customerName: 'Amit Verma',
    customerPhone: '+91-9988776655',
    partySize: 2,
    status: 'COMPLETED',
    allocationType: 'AUTOMATIC',
    checkInTime: new Date(Date.now() - 180 * 60000).toISOString(),
    checkOutTime: new Date(Date.now() - 120 * 60000).toISOString(),
    diningDurationMinutes: 60,
    staffName: 'John Waiter',
    notes: 'Quick lunch'
  },
  {
    id: 98,
    tableId: 3,
    tableNumber: 'T-03',
    customerId: 3,
    customerName: 'Sneha Reddy',
    customerPhone: '+91-9765432109',
    partySize: 4,
    status: 'COMPLETED',
    allocationType: 'AUTOMATIC',
    checkInTime: new Date(Date.now() - 240 * 60000).toISOString(),
    checkOutTime: new Date(Date.now() - 165 * 60000).toISOString(),
    diningDurationMinutes: 75,
    staffName: 'Sarah Server',
    notes: 'Afternoon dining'
  }
];

export const INITIAL_LOGS = [
  {
    id: 501,
    table: { id: 2, tableNumber: 'T-02' },
    previousStatus: 'AVAILABLE',
    newStatus: 'OCCUPIED',
    reason: 'Customer check-in (Party of 2)',
    changedAt: new Date(Date.now() - 42 * 60000).toISOString()
  },
  {
    id: 502,
    table: { id: 5, tableNumber: 'T-05' },
    previousStatus: 'OCCUPIED',
    newStatus: 'CLEANING',
    reason: 'Customer checkout completed (68 mins)',
    changedAt: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 503,
    table: { id: 10, tableNumber: 'B-02' },
    previousStatus: 'OCCUPIED',
    newStatus: 'CLEANING',
    reason: 'Customer checkout completed (52 mins)',
    changedAt: new Date(Date.now() - 8 * 60000).toISOString()
  },
  {
    id: 504,
    table: { id: 9, tableNumber: 'B-01' },
    previousStatus: 'AVAILABLE',
    newStatus: 'RESERVED',
    reason: 'Table reserved for Sneha Reddy',
    changedAt: new Date(Date.now() - 60 * 60000).toISOString()
  },
  {
    id: 505,
    table: { id: 1, tableNumber: 'T-01' },
    previousStatus: 'CLEANING',
    newStatus: 'AVAILABLE',
    reason: 'Table sanitized and ready',
    changedAt: new Date(Date.now() - 110 * 60000).toISOString()
  }
];

