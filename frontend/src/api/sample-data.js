const participants = [
  ['Juan Dela Cruz', '09171234567', 'juan@example.com', 'Toyota Supra MK4', 'ABC 1234', 'Competitor', 'Confirmed', 2500, 1000],
  ['Mia Santos', '09181234568', 'mia@example.com', 'Nissan Skyline R34', 'MIA 2027', 'VIP', 'CheckedIn', 5000, 5000],
  ['Rafael Lim', '09201234569', 'rafael@example.com', 'Honda Civic Type R', 'RFL 818', 'Competitor', 'Pending', 2500, 0],
  ['Arielle Cruz', '09211234570', 'arielle@example.com', 'Mazda RX-7 FD', 'ARI 707', 'Exhibitor', 'Confirmed', 1800, 1800],
  ['Marco Reyes', '09221234571', 'marco@example.com', 'Ford Mustang GT', 'MRK 501', 'Competitor', 'CheckedIn', 2500, 2500],
  ['Lia Navarro', '09231234572', 'lia@example.com', 'Subaru WRX STI', 'LIA 222', 'Exhibitor', 'Confirmed', 1800, 900],
  ['Caleb Tan', '09241234573', 'caleb@example.com', 'BMW M4 Competition', 'CBL 404', 'VIP', 'Confirmed', 5000, 2500],
  ['Sofia Garcia', '09251234574', 'sofia@example.com', 'Porsche 911 Carrera', 'SFG 911', 'VIP', 'CheckedIn', 5000, 5000],
  ['Noah Villanueva', '09261234575', 'noah@example.com', 'Mitsubishi Lancer Evo IX', 'NVL 909', 'Competitor', 'Pending', 2500, 1000],
  ['Elise Wong', '09271234576', 'elise@example.com', 'Volkswagen Golf GTI', 'ELS 616', 'Exhibitor', 'Confirmed', 1800, 1800],
  ['Gabriel Flores', '09281234577', 'gabriel@example.com', 'Chevrolet Camaro SS', 'GFL 808', 'Competitor', 'Cancelled', 2500, 0],
  ['Tessa Ramos', '09291234578', 'tessa@example.com', 'Toyota GR86', 'TSR 326', 'Exhibitor', 'Confirmed', 1800, 900],
  ['Andre Bautista', '09301234579', 'andre@example.com', 'Lexus LC 500', 'ADB 500', 'VIP', 'CheckedIn', 5000, 5000],
  ['Bianca Uy', '09311234580', 'bianca@example.com', 'Mercedes-AMG GT', 'BUY 777', 'VIP', 'Pending', 5000, 0],
  ['Dylan Chua', '09321234581', 'dylan@example.com', 'Hyundai Ioniq 5 N', 'DLC 505', 'Exhibitor', 'Confirmed', 1800, 1800],
  ['Nico Mendoza', '09331234582', 'nico@example.com', 'Honda NSX', 'NMD 199', 'Competitor', 'CheckedIn', 2500, 2500],
  ['Celine Ong', '09341234583', 'celine@example.com', 'Audi R8 V10', 'CON 888', 'VIP', 'Confirmed', 5000, 2500],
  ['Luis Mercado', '09351234584', 'luis@example.com', 'Mazda MX-5 Miata', 'LMD 515', 'Exhibitor', 'Pending', 1800, 0],
  ['Mara Velasco', '09361234585', 'mara@example.com', 'Kia Stinger GT', 'MVS 321', 'Competitor', 'Confirmed', 2500, 2500],
  ['Ethan Sy', '09371234586', 'ethan@example.com', 'Toyota AE86 Trueno', 'ESY 086', 'Competitor', 'Cancelled', 2500, 0],
  ['Yvette Tan', '09381234587', 'yvette@example.com', 'Jaguar F-Type', 'YTN 777', 'VIP', 'CheckedIn', 5000, 5000],
  ['Paolo Rivera', '09391234588', 'paolo@example.com', 'Ford Bronco', 'PRV 404', 'Exhibitor', 'Confirmed', 1800, 1800],
  ['Hannah Go', '09401234589', 'hannah@example.com', 'Tesla Model 3 Performance', 'HGO 303', 'Exhibitor', 'Pending', 1800, 900],
  ['Diego Cortez', '09411234590', 'diego@example.com', 'Nissan 370Z', 'DCR 370', 'Competitor', 'Confirmed', 2500, 1000],
  ['Rina Velasco', '09421234591', 'rina@example.com', 'Alfa Romeo 4C', 'RVC 444', 'VIP', 'Cancelled', 5000, 0],
]

function getPaymentStatus(registrationFee, amountPaid) {
  if (amountPaid <= 0) return 'Unpaid'
  if (amountPaid < registrationFee) return 'Partial'
  return 'Paid'
}

const registrations = participants.map((participant, index) => {
  const [participantName, contactNumber, email, carMakeModel, plateNumber, registrationType, status, registrationFee, amountPaid] = participant
  const day = String(10 + (index % 16)).padStart(2, '0')
  const hour = String(8 + (index % 9)).padStart(2, '0')
  return {
    id: `3f2c9a1e-${String(index + 1).padStart(4, '0')}-4c27-a8d1-${String(index + 1).padStart(12, '0')}`,
    registrationNumber: `CS27-${String(index + 1).padStart(4, '0')}`,
    registrationDate: `2027-02-${day}T${hour}:30:00Z`,
    participantName,
    contactNumber,
    email,
    address: `${100 + index} Rizal St., Sorsogon City`,
    carMakeModel,
    plateNumber,
    registrationType,
    status,
    registrationFee,
    amountPaid,
    paymentStatus: getPaymentStatus(registrationFee, amountPaid),
  }
})

export const sampleRegistrations = registrations

export async function getRegistrations({ participantName = '', type = '', status = '', page = 1, pageSize = 10 } = {}) {
  await new Promise((resolve) => window.setTimeout(resolve, 350))
  const normalizedName = participantName.trim().toLowerCase()
  const filtered = registrations.filter((registration) => (
    (!normalizedName || registration.participantName.toLowerCase().includes(normalizedName))
    && (!type || registration.registrationType === type)
    && (!status || registration.status === status)
  ))
  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start = (currentPage - 1) * pageSize
  return {
    items: filtered.slice(start, start + pageSize),
    page: currentPage,
    pageSize,
    totalCount,
    totalPages,
  }
}

export async function getSummary() {
  await new Promise((resolve) => window.setTimeout(resolve, 250))
  return registrations.reduce((summary, registration) => {
    summary.totalRegistrations += 1
    summary.totalFees += registration.registrationFee
    summary.totalPayments += registration.amountPaid
    if (registration.status === 'Confirmed') summary.confirmed += 1
    if (registration.status === 'CheckedIn') summary.checkedIn += 1
    if (registration.status === 'Pending') summary.pending += 1
    if (registration.status === 'Cancelled') summary.cancelled += 1
    summary.uncollectedPayments += registration.registrationFee - registration.amountPaid
    return summary
  }, {
    totalRegistrations: 0,
    confirmed: 0,
    checkedIn: 0,
    pending: 0,
    cancelled: 0,
    totalFees: 0,
    totalPayments: 0,
    uncollectedPayments: 0,
  })
}
