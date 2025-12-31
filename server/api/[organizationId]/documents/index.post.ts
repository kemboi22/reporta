import { createDocument } from "~~/server/services";
import { auth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const organizationId = getRouterParam(event, "organizationId");
  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  try {
    const formData = await readFormData(event);
    const file = formData.get("file") as File | null;
    const workspaceId = formData.get("workspaceId") as string;
    const projectId = formData.get("projectId") as string | null;
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const category = formData.get("category") as string | null;
    const tags = formData.get("tags") as string | null;
    const visibility = formData.get("visibility") as string | null;
    const isPinned = formData.get("isPinned") === "true";

    const document = await createDocument({
      file,
      uploadedBy: session.user.id,
      workspaceId,
      projectId: projectId || null,
      name: name || null,
      description,
      category,
      tags: tags ? tags.split(",").map((t) => t.trim()) : null,
      visibility,
      isPinned,
    });

    setResponseStatus(event, 201);
    return document;
  } catch (error: any) {
    console.error("Document upload error:", error);
    throw createError({ statusCode: 500, message: error.message || "Failed to upload document" });
  }
});
