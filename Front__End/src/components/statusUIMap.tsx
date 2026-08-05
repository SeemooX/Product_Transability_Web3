import {Check, PackageCheck, Store, Warehouse, Truck, Clock, Send, Box} from "lucide-react";
import type { StatusUIConfig } from "@/types/product";

export const statusUIMap: Record<string, StatusUIConfig> = {
  CREATED: {
    color: "bg-blue-500",
    icon: <Clock/>,
  },
  PICKED_UP: {
    color: "bg-yellow-500",
    icon: <PackageCheck/>,
  },
  DELIVERED_TO_WAREHOUSE: {
    color: "bg-purple-500",
    icon: <Warehouse/>,
  },
  RECEIVED_AT_WAREHOUSE: {
    color: "bg-purple-500",
    icon: <Warehouse/>,
  },
  READY_FOR_DISPATCH: {
    color: "bg-orange-500",
    icon: <Send/>,
  },
  PICKED_UP_FROM_WAREHOUSE: {
    color: "bg-blue-500",
    icon: <Truck/>,
  },
  DELIVERED_TO_STORE: {
    color: "bg-green-500",
    icon: <Store/>,
  },
  AVAILABLE_FOR_SALE: {
    color: "bg-green-500",
    icon: <Check/>,
  },
};

export const getStatusUI = (code: string): StatusUIConfig => {
  return (
    statusUIMap[code] ?? {
      color: "bg-gray-500",
      icon: <Box/>,
    }
  );
};