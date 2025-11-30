import {
  PrismaClient,
  Role,
  TransmissionType,
  VehicleStatus,
  VerificationStatus,
  VerificationType,
} from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('seeding database...');

  const password = 'password';

  const hashedPassword = await bcrypt.hash(password, 10);

  // user seeder with 3 roles: ADMIN, PARTNER, CUSTOMER
  const admin = await prisma.user.create({
    data: {
      fullname: 'Admin Super',
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      phone_number: '0811111111',
      address: 'Jakarta',
      role: Role.ADMIN,
      is_verified: true,
    },
  });

  const partner = await prisma.user.create({
    data: {
      fullname: 'Partner Motor',
      username: 'partner1',
      email: 'partner@example.com',
      password: hashedPassword,
      phone_number: '0822222222',
      address: 'Bandung',
      role: Role.PARTNER,
      is_verified: true,
    },
  });

  const customer = await prisma.user.create({
    data: {
      fullname: 'Customer One',
      username: 'customer1',
      email: 'customer@example.com',
      password: hashedPassword,
      phone_number: '0833333333',
      address: 'Surabaya',
      role: Role.CUSTOMER,
      is_verified: true,
    },
  });

  // verification seeder for customer
  await prisma.userVerification.create({
    data: {
      user_id: customer.id,
      verif_type: VerificationType.KTP,
      document_number: '1234567890',
      document_url: 'https://dummy.com/ktp.jpg',
      selfie_url: 'https://dummy.com/selfie.jpg',
      verification_status: VerificationStatus.APPROVED,
      verified_by: admin.id,
    },
  });

  // otp verification seeder for customer
  await prisma.otpVerification.create({
    data: {
      user_id: customer.id,
      otp_code: '123456',
      expires_at: new Date(Date.now() + 1000 * 60 * 10),
    },
  });

  // password reset token seeder for customer
  await prisma.passwordResetToken.create({
    data: {
      email: customer.email,
      token: 'reset-token-123',
      expires_at: new Date(Date.now() + 1000 * 60 * 15),
    },
  });

  // category seeder
  const motor = await prisma.category.create({
    data: { name: 'Motor', description: 'Kendaraan roda dua' },
  });

  const mobil = await prisma.category.create({
    data: { name: 'Mobil', description: 'Kendaraan roda empat' },
  });

  const listrik = await prisma.category.create({
    data: {
      name: 'Kendaraan Listrik',
      description: 'Kendaraan ramah lingkungan berbasis listrik',
    },
  });

  // vehicle seeder
  const vehicle1 = await prisma.vehicle.create({
    data: {
      partner_id: partner.id,
      category_id: mobil.id,
      vehicle_name: 'Toyota Camry',
      price: 500000,
      vehicle_year: 2022,
      license_plate: 'B1234XYZ',
      description: 'Sedan mewah',
      status: VehicleStatus.AVAILABLE,
      image_url: 'https://dummy.com/camry.jpg',
      transmission: TransmissionType.AUTOMATIC,
      specification: 'Full spec',
      features: 'AC, Audio, Leather seats',
      capacity: 5,
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      partner_id: partner.id,
      category_id: motor.id,
      vehicle_name: 'Yamaha NMAX',
      price: 150000,
      vehicle_year: 2023,
      license_plate: 'D9876ABC',
      description: 'Motor matic populer',
      status: VehicleStatus.AVAILABLE,
      image_url: 'https://dummy.com/nmax.jpg',
      transmission: TransmissionType.AUTOMATIC,
      specification: '155cc, ABS',
      features: 'Smart Key, ABS',
      capacity: 2,
    },
  });

  const vehicle3 = await prisma.vehicle.create({
    data: {
      partner_id: partner.id,
      category_id: listrik.id,
      vehicle_name: 'Tesla Model 3',
      price: 1200000,
      vehicle_year: 2023,
      license_plate: 'B9999EV',
      description: 'Mobil listrik premium',
      status: VehicleStatus.AVAILABLE,
      image_url: 'https://dummy.com/tesla.jpg',
      transmission: TransmissionType.AUTOMATIC,
      specification: 'Long Range, Full Electric',
      features: 'Autopilot, Smart Display',
      capacity: 5,
    },
  });

  // rating seeder
  await prisma.rating.create({
    data: {
      customer_id: customer.id,
      vehicle_id: vehicle1.id,
      rating: 5,
      review: 'Mobil bagus dan nyaman',
    },
  });

  // favorite seeder
  await prisma.favorite.create({
    data: {
      customer_id: customer.id,
      vehicle_id: vehicle2.id,
    },
  });

  console.log('seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
