import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MapPin, Star, Users, Bed } from "lucide-react";
import type { Room } from "./room.types";

type RoomCardProps = {
  room: Room;
  onClick?: (room: Room) => void;
};

export function RoomCard({ room, onClick }: RoomCardProps) {
  return (
    <Card
      className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
      onClick={() => onClick?.(room)}
    >
      {/* Imagen */}
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={room.imageUrl || "/src/assets/image.png"}
          alt={room.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>

      {/* Header */}
      <CardHeader className="gap-1">
        <CardTitle className="text-lg line-clamp-1">
          {room.title}
        </CardTitle>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {room.location}
        </div>
      </CardHeader>

      {/* Content */}
      {(room.guests || room.beds) && (
        <CardContent className="flex gap-4 text-sm text-muted-foreground">
          {room.guests && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {room.guests}
            </div>
          )}

          {room.beds && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {room.beds}
            </div>
          )}
        </CardContent>
      )}

      {/* Footer */}
      <CardFooter className="flex items-center justify-between">
        <span className="text-lg font-semibold text-emerald-600">
          ${room.price}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            / noche
          </span>
        </span>

        {room.rating && (
          <span className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {room.rating}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
