import { authClient } from "~/lib/auth";
import type { OrganizationRole } from "#shared/types";

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
export interface Timezone {
  value: string;
  label: string;
  offset: string;
}

export const getTimezones = (): Timezone[] => {
  const timezones = Intl.supportedValuesOf("timeZone");
  const now = new Date();

  return timezones
    .map((tz) => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        timeZoneName: "shortOffset",
      });

      const parts = formatter.formatToParts(now);
      const offsetPart = parts.find((p) => p.type === "timeZoneName");
      const offset = offsetPart ? offsetPart.value : "";

      return {
        value: tz,
        label: tz.replace(/_/g, " "),
        offset,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
};

export const getDefaultTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatTimezone = (timezone: string): string => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "long",
  });

  const parts = formatter.formatToParts(now);
  const timeZoneName = parts.find((p) => p.type === "timeZoneName");

  return `${timezone.replace(/_/g, " ")} (${timeZoneName?.value || ""})`;
};

export const searchTimezones = (
  query: string,
  timezones: Timezone[],
): Timezone[] => {
  const lowerQuery = query.toLowerCase();
  return timezones.filter(
    (tz) =>
      tz.label.toLowerCase().includes(lowerQuery) ||
      tz.value.toLowerCase().includes(lowerQuery) ||
      tz.offset.toLowerCase().includes(lowerQuery),
  );
};

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const getCurrencies = (): Currency[] => {
  const currencies = Intl.supportedValuesOf("currency");
  const commonCurrencies = [
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "CNY",
    "INR",
    "KES",
    "AUD",
    "CAD",
    "CHF",
    "SGD",
    "HKD",
    "NZD",
    "ZAR",
    "NGN",
    "EGP",
    "SAR",
    "AED",
  ];

  return currencies
    .map((code) => {
      try {
        const formatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: code,
          currencyDisplay: "symbol",
        });
        const parts = formatter.formatToParts(1000);
        const symbol = parts.find((p) => p.type === "currency")?.value || code;

        const nameFormatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: code,
          currencyDisplay: "name",
        });
        const nameParts = nameFormatter.formatToParts(1000);
        const name =
          nameParts.find((p) => p.type === "currency")?.value || code;

        return {
          code,
          name: name.replace(/[A-Z]{3}/, "").trim() || code,
          symbol,
        };
      } catch {
        return {
          code,
          name: code,
          symbol: code,
        };
      }
    })
    .sort((a, b) => {
      const aIndex = commonCurrencies.indexOf(a.code);
      const bIndex = commonCurrencies.indexOf(b.code);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      return a.name.localeCompare(b.name);
    });
};

export const searchCurrencies = (
  query: string,
  currencies: Currency[],
): Currency[] => {
  const lowerQuery = query.toLowerCase();
  return currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(lowerQuery) ||
      currency.name.toLowerCase().includes(lowerQuery) ||
      currency.symbol.toLowerCase().includes(lowerQuery),
  );
};

export const isRole = (role: OrganizationRole): boolean => {
  const session = authClient.useSession();
  const route = useRoute();
  const params = route.params as Record<string, string | undefined>;
  const organizationId = params.organizationId;

  if (!organizationId) return false;

  const org = session.value?.data?.user.organizations?.find(
    (org) => org.id === organizationId,
  );

  return org?.role === role;
};

export const isAdmin = (): boolean => {
  return isRole("ADMIN") || isRole("OWNER");
};

export const isOwner = (): boolean => {
  return isRole("OWNER");
};

export const canManageUsers = (): boolean => {
  return isAdmin();
};

export const canManageOrganization = (): boolean => {
  return isAdmin();
};

export const canManageBilling = (): boolean => {
  return isOwner();
};

export const canManageIntegrations = (): boolean => {
  return isAdmin();
};

export const canManageSecurity = (): boolean => {
  return isAdmin();
};

export const canViewAllStaff = (): boolean => {
  return isAdmin();
};

export const canManageHR = (): boolean => {
  return isAdmin();
};
