import { useState } from "react";
import { HospitalityService, HospitalityFormData } from "@/types/hospitality.types";

const getInitialFormData = (): HospitalityFormData => ({
  nombreHotel: "",
  cedulaJuridica: "",
  tipoHospedaje: undefined,
  direccion: {
    provincia: "",
    canton: "",
    distrito: "",
    barrio: "",
    senasExactas: "",
  },
  referenciaGPS: "",
  telefono1: "",
  telefono2: "",
  email: "",
  sitioWeb: "",
  redesSociales: {
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: "",
    airbnb: "",
    threads: "",
    x: "",
  },
  servicios: [],
});

export function useHospitalityForm() {
  const [formData, setFormData] = useState<HospitalityFormData>(getInitialFormData());
  const [editingService, setEditingService] = useState<HospitalityService | null>(null);

  const resetForm = () => {
    setFormData(getInitialFormData());
    setEditingService(null);
  };

  const loadServiceForEdit = (service: HospitalityService) => {
    setEditingService(service);
    setFormData(service);
  };

  const updateFormField = <K extends keyof HospitalityFormData>(
    field: K,
    value: HospitalityFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateDireccionField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      direccion: { ...prev.direccion!, [field]: value },
    }));
  };

  const updateRedesSocialesField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      redesSociales: { ...prev.redesSociales!, [field]: value },
    }));
  };

  const toggleServicio = (servicio: string) => {
    const currentServicios = formData.servicios || [];
    if (currentServicios.includes(servicio)) {
      setFormData({
        ...formData,
        servicios: currentServicios.filter((s) => s !== servicio),
      });
    } else {
      setFormData({
        ...formData,
        servicios: [...currentServicios, servicio],
      });
    }
  };

  return {
    formData,
    editingService,
    resetForm,
    loadServiceForEdit,
    updateFormField,
    updateDireccionField,
    updateRedesSocialesField,
    toggleServicio,
    setFormData,
  };
}
