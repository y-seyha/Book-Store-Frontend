import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {DeliveryStatus} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusMessage(status?: DeliveryStatus) {
  switch (status) {
    case "preparing":
      return "📦 Your order is being prepared";
    case "picked_up":
      return "📦 Picked up by driver";
    case "on_the_way":
      return "🚚 Your order is on the way";
    case "delivered":
      return "✅ Delivered successfully";
    case "cancelled":
      return "❌ Order cancelled";
    default:
      return "";
  }
}