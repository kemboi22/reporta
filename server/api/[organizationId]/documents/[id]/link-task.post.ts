import { linkDocumentToTask, unlinkDocumentFromTask } from "~~/server/services";
import { auth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);
  const { documentId, taskId, action } = body;

  if (!documentId || !taskId) {
    throw createError({ statusCode: 400, message: "Document ID and Task ID are required" });
  }

  if (action === "link") {
    await linkDocumentToTask(documentId, taskId);
    return { success: true, message: "Document linked to task" };
  } else if (action === "unlink") {
    await unlinkDocumentFromTask(documentId, taskId);
    return { success: true, message: "Document unlinked from task" };
  } else {
    throw createError({ statusCode: 400, message: "Invalid action" });
  }
});