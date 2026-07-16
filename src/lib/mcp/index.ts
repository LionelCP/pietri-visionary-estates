import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProperties from "./tools/list-properties";
import getProperty from "./tools/get-property";
import searchProperties from "./tools/search-properties";
import updatePropertyStatus from "./tools/update-property-status";
import updatePropertyMedia from "./tools/update-property-media";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "cabinet-pietri-mcp",
  title: "Cabinet Pietri Immobilier",
  version: "0.1.0",
  instructions:
    "Outils pour gérer et interroger les biens du site Cabinet Pietri Immobilier. Utilisez list_properties et search_properties pour explorer, get_property pour les détails, update_property_status et update_property_media pour modifier (admin requis).",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProperties, getProperty, searchProperties, updatePropertyStatus, updatePropertyMedia],
});
