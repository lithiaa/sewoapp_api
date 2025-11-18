import { Prisma } from 'generated/prisma';

export type VehicleWithConditionalFavorites = Prisma.VehicleGetPayload<{
  select: {
    id: true;
    vehicle_name: true;
    price: true;
    vehicle_year: true;
    license_plate: true;
    description: true;
    status: true;
    image_url: true;
    transmission: true;
    specification: true;
    features: true;
    capacity: true;
    created_at: true;
    updated_at: true;
    partner: { select: { id: true; fullname: true } };
    category: { select: { name: true } };
    favorites: { where: { customer_id: number }; select: { id: true } } | false;
  };
}>;

export type VehicleOutput = Omit<
  VehicleWithConditionalFavorites,
  'favorites'
> & {
  is_favorited: boolean;
};
