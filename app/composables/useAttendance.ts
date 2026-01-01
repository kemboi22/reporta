export function useAttendance() {
  const route = useRoute();
  const params = route.params as Record<string, string>;
  const orgId = params.organizationId;

  const checkIn = async (data: {
    staffId: string;
    deviceId?: string;
    location?: string;
    notes?: string;
  }) => {
    return await $fetch(`/api/${orgId}/attendance`, {
      method: "POST",
      body: data,
    });
  };

  const checkOut = async (attendanceId: string, notes?: string) => {
    return await $fetch(`/api/${orgId}/attendance/${attendanceId}/checkout`, {
      method: "POST",
      body: { notes },
    });
  };

  const getTodayAttendance = async () => {
    const today = new Date().toISOString().split('T')[0];
    return await $fetch(`/api/${orgId}/attendance?startDate=${today}T00:00:00.000Z`);
  };

  const getAttendance = async (params?: {
    staffId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    skip?: number;
    take?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.staffId) queryParams.append("staffId", params.staffId);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.skip) queryParams.append("skip", params.skip.toString());
    if (params?.take) queryParams.append("take", params.take.toString());

    return await $fetch(`/api/${orgId}/attendance?${queryParams.toString()}`);
  };

  const updateAttendance = async (id: string, data: any) => {
    return await $fetch(`/api/${orgId}/attendance/${id}`, {
      method: "PUT",
      body: data,
    });
  };

  return {
    checkIn,
    checkOut,
    getTodayAttendance,
    getAttendance,
    updateAttendance,
  };
}
