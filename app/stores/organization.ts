export const useOrganizationStore = defineStore("organization", () => {
  const organizationForm = ref<{
    name?: string;
    industry?: string;
    logo?: File | string | null;
    inviteEmails: string[];
    settings: {
      timezone: string;
      currency: string;
      workingHoursStart: string;
      workingHoursEnd: string;
      weekendDays: string[];
      logo?: string;
    };
  }>({
    inviteEmails: [] as string[],
    settings: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currency: 'USD',
      workingHoursStart: '09:00',
      workingHoursEnd: '17:00',
      weekendDays: ['saturday', 'sunday'],
    },
  });

  return {
    organizationForm,
  };
});
