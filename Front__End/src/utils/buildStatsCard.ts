import type { DashboardStat } from "@/types/statistics";

export const buildStatsCards = (role: string, stats: any): DashboardStat[] => {
  switch (role.toLowerCase()) {

    case "manufacturer":
      return [
        {
          value: stats.total,
          label: "Produits enregistrés",
          color: "bg-green-100",
          icon: "🟢",
        },
        {
          value: stats.shipping,
          label: "En transit",
          color: "bg-orange-100",
          icon: "🟡",
        },
        {
          value: stats.shipped,
          label: "Livrés",
          color: "bg-green-100",
          icon: "🟢",
        },
        {
          value: stats.waiting,
          label: "En attente",
          color: "bg-red-100",
          icon: "🔴",
        },
      ];


    case "transporter":
      return [
        {
          value: stats.available,
          label: "Disponibles",
          color: "bg-blue-100",
          icon: "📦",
        },
        {
          value: stats.picked,
          label: "Récupérés",
          color: "bg-orange-100",
          icon: "🚚",
        },
        {
          value: stats.delivered,
          label: "Livrés",
          color: "bg-green-100",
          icon: "✅",
        },
      ];


    case "warehouse":
      return [
        {
          value: stats.received,
          label: "Reçus",
          color: "bg-blue-100",
          icon: "📥",
        },
        {
          value: stats.ready,
          label: "Prêts à expédier",
          color: "bg-orange-100",
          icon: "📤",
        },
      ];


    case "store":
      return [
        {
          value: stats.available,
          label: "Disponibles",
          color: "bg-green-100",
          icon: "🛒",
        },
      ];


    default:
      return [];
  }
};