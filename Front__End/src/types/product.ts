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
  createdAt: string;
  updatedAt: string;
}

export interface ProductMan {
  id_product: string; // UUID
  manufacturerId: string; // UUID (references users.id_user)
  name: string;
  reference?: string | null;
  serialNumber?: string | null;
  description?: string | null;
  currentStatus: string;
  qrCode?: string | null;
  metadataHash?: string | null;
  createdAt: string;
  updatedAt: string;
  manufacturerName: string;
  currentLocation: string;
  statusSince: string;
}