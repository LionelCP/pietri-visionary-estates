export type {
  GalleryImage,
  Property,
  PropertyFormValues,
  PropertyPublicView,
  PropertyRegion,
  PropertySaveValues,
  PropertyStatus,
  PropertyType,
  PublicationStatus,
  RpcResult,
  TransactionType,
} from "@/types/property";
export type { PropertyCreatePayload, PropertySavePayload } from "@/lib/property-payloads";
export {
  formatLocation,
  formatPrice,
  getPropertyAmenities,
  getPropertyDescription,
  getPropertyReference,
  getPropertySeoDescription,
  getPropertySeoTitle,
  getPropertyTitle,
  isPublicProperty,
  legacyStatusToPublicationStatus,
  mapPropertyRow,
  sortForPublic,
} from "@/lib/property-normalizers";
export { buildPropertyCreatePayload, buildPropertyUpdatePayload } from "@/lib/property-payloads";
export { validatePublicationFields } from "@/lib/property-validation";
export {
  createProperty,
  fetchAllProperties,
  fetchFeaturedProperties,
  fetchPropertyById,
  fetchPropertyBySlug,
  fetchPublicProperties,
  updateProperty,
} from "@/lib/property-services";
export {
  archiveProperty,
  publishProperty,
  unpublishProperty,
  validatePropertyForPublication,
} from "@/lib/property-publication";
