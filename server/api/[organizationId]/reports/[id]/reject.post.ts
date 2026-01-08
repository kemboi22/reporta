import { auth } from "~~/server/utils/auth";
import { rejectReport } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    return { success: false, error: "Report ID is required" };
  }

  try {
    const body = await readBody(event);
    const session = await auth.api.getSession({
      headers: event.headers,
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const reviewedBy = body.reviewedBy || session.user.id;
    const report = await rejectReport(id, reviewedBy);

    return { success: true, data: report };
  } catch (error: any) {
    console.error("Failed to reject report:", error);
    return { success: false, error: error?.message || "Failed to reject report" };
  }
});
