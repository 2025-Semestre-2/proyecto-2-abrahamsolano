import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { HospitalityFormData } from "@/types/hospitality.types";
import {
  SERVICIOS_DISPONIBLES,
  PROVINCIAS_LIMON,
  TIPOS_HOSPEDAJE,
} from "@/components/constants/hospitality.constants";

interface HospitalityFormProps {
  formData: HospitalityFormData;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onUpdateField: <K extends keyof HospitalityFormData>(
    field: K,
    value: HospitalityFormData[K]
  ) => void;
  onUpdateDireccion: (field: string, value: string) => void;
  onUpdateRedesSociales: (field: string, value: string) => void;
  onToggleServicio: (servicio: string) => void;
}

export function HospitalityForm({
  formData,
  isEditing,
  onSubmit,
  onCancel,
  onUpdateField,
  onUpdateDireccion,
  onUpdateRedesSociales,
  onToggleServicio,
}: HospitalityFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 mt-4">
      {/* Información Básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información Básica</h3>

        <div className="space-y-2">
          <Label htmlFor="nombreHotel">Nombre del Hotel *</Label>
          <Input
            id="nombreHotel"
            placeholder="ej: Hotel Caribe Paraíso"
            value={formData.nombreHotel}
            onChange={(e) => onUpdateField("nombreHotel", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cedulaJuridica">Cédula Jurídica *</Label>
            <Input
              id="cedulaJuridica"
              placeholder="3-101-123456"
              value={formData.cedulaJuridica}
              onChange={(e) => onUpdateField("cedulaJuridica", e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Debe ser única en el sistema
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipoHospedaje">Tipo de Hospedaje *</Label>
            <Select
              value={formData.tipoHospedaje}
              onValueChange={(value: any) =>
                onUpdateField("tipoHospedaje", value)
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione tipo" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_HOSPEDAJE.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Dirección */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Dirección Completa</h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="provincia">Provincia *</Label>
            <Select
              value={formData.direccion?.provincia}
              onValueChange={(value) => onUpdateDireccion("provincia", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCIAS_LIMON.map((prov) => (
                  <SelectItem key={prov} value={prov}>
                    {prov}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="canton">Cantón *</Label>
            <Input
              id="canton"
              placeholder="ej: Talamanca"
              value={formData.direccion?.canton}
              onChange={(e) => onUpdateDireccion("canton", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="distrito">Distrito *</Label>
            <Input
              id="distrito"
              placeholder="ej: Puerto Viejo"
              value={formData.direccion?.distrito}
              onChange={(e) => onUpdateDireccion("distrito", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="barrio">Barrio *</Label>
          <Input
            id="barrio"
            placeholder="ej: Playa Cocles"
            value={formData.direccion?.barrio}
            onChange={(e) => onUpdateDireccion("barrio", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="senasExactas">Señas Exactas *</Label>
          <Textarea
            id="senasExactas"
            placeholder="ej: 200 metros sur de la entrada principal a Playa Cocles"
            rows={2}
            value={formData.direccion?.senasExactas}
            onChange={(e) =>
              onUpdateDireccion("senasExactas", e.target.value)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="referenciaGPS">Referencia GPS *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="referenciaGPS"
              placeholder="ej: 9.6500, -82.7500"
              value={formData.referenciaGPS}
              onChange={(e) => onUpdateField("referenciaGPS", e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-gray-500">Formato: Latitud, Longitud</p>
        </div>
      </div>

      {/* Contacto */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información de Contacto</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="telefono1">Teléfono 1 *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="telefono1"
                type="tel"
                placeholder="+506 2750-0000"
                value={formData.telefono1}
                onChange={(e) => onUpdateField("telefono1", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono2">Teléfono 2 *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="telefono2"
                type="tel"
                placeholder="+506 8888-8888"
                value={formData.telefono2}
                onChange={(e) => onUpdateField("telefono2", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="info@hotelcaribe.com"
              value={formData.email}
              onChange={(e) => onUpdateField("email", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sitioWeb">Sitio Web</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="sitioWeb"
              type="url"
              placeholder="https://www.hotelcaribe.com"
              value={formData.sitioWeb}
              onChange={(e) => onUpdateField("sitioWeb", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Redes Sociales</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <div className="relative">
              <Facebook className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="facebook"
                placeholder="facebook.com/hotelcaribe"
                value={formData.redesSociales?.facebook}
                onChange={(e) =>
                  onUpdateRedesSociales("facebook", e.target.value)
                }
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <div className="relative">
              <Instagram className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="instagram"
                placeholder="@hotelcaribe"
                value={formData.redesSociales?.instagram}
                onChange={(e) =>
                  onUpdateRedesSociales("instagram", e.target.value)
                }
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube</Label>
            <div className="relative">
              <Youtube className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="youtube"
                placeholder="youtube.com/@hotelcaribe"
                value={formData.redesSociales?.youtube}
                onChange={(e) =>
                  onUpdateRedesSociales("youtube", e.target.value)
                }
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tiktok">TikTok</Label>
            <Input
              id="tiktok"
              placeholder="@hotelcaribe"
              value={formData.redesSociales?.tiktok}
              onChange={(e) => onUpdateRedesSociales("tiktok", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="airbnb">Airbnb</Label>
            <Input
              id="airbnb"
              placeholder="airbnb.com/h/hotelcaribe"
              value={formData.redesSociales?.airbnb}
              onChange={(e) => onUpdateRedesSociales("airbnb", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="threads">Threads</Label>
            <Input
              id="threads"
              placeholder="@hotelcaribe"
              value={formData.redesSociales?.threads}
              onChange={(e) =>
                onUpdateRedesSociales("threads", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="x">X (Twitter)</Label>
            <Input
              id="x"
              placeholder="@hotelcaribe"
              value={formData.redesSociales?.x}
              onChange={(e) => onUpdateRedesSociales("x", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Servicios */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Servicios del Establecimiento</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SERVICIOS_DISPONIBLES.map((servicio) => (
            <div key={servicio} className="flex items-center space-x-2">
              <Checkbox
                id={servicio}
                checked={formData.servicios?.includes(servicio)}
                onCheckedChange={() => onToggleServicio(servicio)}
              />
              <Label
                htmlFor={servicio}
                className="text-sm font-normal cursor-pointer"
              >
                {servicio}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          {isEditing ? "Actualizar" : "Registrar"} Servicio
        </Button>
      </div>
    </form>
  );
}
