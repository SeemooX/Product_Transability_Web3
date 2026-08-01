export interface Product {
  id_product: string; // UUID
  manufacturerId: string; // UUID (references users.id_user)
  name: string;
  reference?: string | null;
  serialNumber?: string | null;
  description?: string | null;
  currentStatus: string;
  qrCode?: string | null;
  metadataHash?: string | null;
  createdAt: Date;
  updatedAt: Date;
}