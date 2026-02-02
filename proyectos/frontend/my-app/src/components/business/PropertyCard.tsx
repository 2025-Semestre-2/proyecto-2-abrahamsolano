import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Property } from "@/types/business.types";

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: number) => void;
}

export function PropertyCard({
  property,
  onEdit,
  onDelete,
}: PropertyCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
        <ImageWithFallback
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg mb-1">{property.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {property.location} • {property.type}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <span>${property.price}/noche</span>
          <span>•</span>
          <span>{property.guests} huéspedes</span>
          <span>•</span>
          <span>{property.beds} camas</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(property)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(property.id)}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </div>
  );
}
