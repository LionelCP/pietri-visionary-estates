import { getPropertyTitle, type Property, type PublicationStatus } from "@/lib/properties";

export type PropertyStatusFilter = "all" | PublicationStatus;
export type PropertySortKey = "default" | "newest" | "oldest" | "title-asc" | "title-desc" | "price-asc" | "price-desc";

export type PropertyListState = {
  query: string;
  status: PropertyStatusFilter;
  sort: PropertySortKey;
};

export type PropertyStatusCounts = Record<PropertyStatusFilter, number>;

export function applyPropertyListState(properties: Property[], state: PropertyListState) {
  return sortProperties(filterProperties(properties, state.query, state.status), state.sort);
}

export function filterProperties(properties: Property[], query: string, status: PropertyStatusFilter) {
  const normalizedQuery = normalize(query);

  return properties.filter((property) => {
    const statusMatches = status === "all" || property.publication_status === status;
    if (!statusMatches) return false;
    if (!normalizedQuery) return true;
    return getSearchableText(property).includes(normalizedQuery);
  });
}

export function sortProperties(properties: Property[], sort: PropertySortKey) {
  if (sort === "default") return [...properties];

  return properties
    .map((property, index) => ({ property, index }))
    .sort((left, right) => {
      const result = compareProperties(left.property, right.property, sort);
      return result === 0 ? left.index - right.index : result;
    })
    .map(({ property }) => property);
}

export function getPropertyStatusCounts(properties: Property[]): PropertyStatusCounts {
  return properties.reduce<PropertyStatusCounts>(
    (counts, property) => {
      counts.all += 1;
      counts[property.publication_status] += 1;
      return counts;
    },
    { all: 0, draft: 0, published: 0, archived: 0 },
  );
}

export function getPropertyLocation(property: Property) {
  return [property.city, property.region, property.country].filter(Boolean).join(" — ");
}

export function getPropertyDisplayTitle(property: Property) {
  return getPropertyTitle(property, "fr") || "Sans titre";
}

function compareProperties(left: Property, right: Property, sort: PropertySortKey) {
  if (sort === "title-asc") return compareText(getPropertyDisplayTitle(left), getPropertyDisplayTitle(right));
  if (sort === "title-desc") return compareText(getPropertyDisplayTitle(right), getPropertyDisplayTitle(left));
  if (sort === "price-asc") return compareNullableNumber(left.price_amount, right.price_amount, "asc");
  if (sort === "price-desc") return compareNullableNumber(left.price_amount, right.price_amount, "desc");
  if (sort === "oldest") return compareText(left.created_at, right.created_at);
  return compareText(right.created_at, left.created_at);
}

function compareText(left: string | null | undefined, right: string | null | undefined) {
  return String(left ?? "").localeCompare(String(right ?? ""), "fr", { sensitivity: "base" });
}

function compareNullableNumber(left: number | null, right: number | null, direction: "asc" | "desc") {
  if (left === null && right === null) return 0;
  if (left === null) return 1;
  if (right === null) return -1;
  return direction === "asc" ? left - right : right - left;
}

function getSearchableText(property: Property) {
  const maybeAddress = property as Property & { address?: string | null };
  return normalize(
    [
      property.title_fr,
      property.title_en,
      property.title,
      property.city,
      property.country,
      maybeAddress.address,
      property.sector,
      property.slug,
    ].filter(Boolean).join(" "),
  );
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
