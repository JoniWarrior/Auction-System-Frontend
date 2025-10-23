"use client";

import AuctionDetailContent from "@/components/auctions/AuctionDetailContent";
// import RolesProtectRoute from "@/components/RoleProtectRoute";

export default function AuctionDetailPage() {
  return (
    // <RolesProtectRoute allowedRoles={["bidder", "seller"]}>
      <AuctionDetailContent />
    // </RolesProtectRoute>
  );
}
