import { auth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email } = body;

  if (!email) {
    throw createError({
      statusCode: 400,
      message: "Email is required",
    });
  }

  try {
    await auth.api.sendResetPasswordEmail({
      body: {
        email,
      },
      headers: event.headers,
    });

    return { message: "Password reset email sent" };
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw createError({
        statusCode: 404,
        message: "User not found with this email",
      });
    }
    throw error;
  }
});
