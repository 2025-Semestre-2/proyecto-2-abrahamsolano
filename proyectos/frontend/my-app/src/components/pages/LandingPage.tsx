// src/components/LandingPage.tsx (o la ruta que uses)
import { Hero } from "@/components/pages/Hero";
import { RoomsGrid } from "@/components/room/RoomGrid";
import type { Room } from "@/components/room/room.types";

interface LandingPageProps {
  onRoomClick?: (room: Room) => void;  
}

export function LandingPage({ onRoomClick }: LandingPageProps) {
  return (
    <>
      <Hero />
      <RoomsGrid onSelectRoom={onRoomClick} />  /
    </>
  );
}