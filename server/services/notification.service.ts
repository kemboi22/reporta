import type { Notification, Prisma } from "@/generated/prisma/client";
import { prisma } from "../utils/db";
import { cacheGet, cacheSet, cacheDel } from "../utils/redis";

const CACHE_TTL = 300;
const CACHE_PREFIX = "notification:";

export type NotificationCreateInput = Prisma.NotificationCreateInput;
export type NotificationUpdateInput = Prisma.NotificationUpdateInput;

export const getNotificationById = async (id: string): Promise<Notification | null> => {
  const cacheKey = `${CACHE_PREFIX}${id}`;
  const cached = await cacheGet<Notification>(cacheKey);
  if (cached) return cached;

  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (notification) {
    await cacheSet(cacheKey, notification, CACHE_TTL);
  }

  return notification;
}

export const getUserNotifications = async (
  userId: string,
  params?: {
    skip?: number;
    take?: number;
    unreadOnly?: boolean;
  }
): Promise<Notification[]> => {
  const { skip = 0, take = 20, unreadOnly = false } = params || {};

  const where: Prisma.NotificationWhereInput = { userId };
  if (unreadOnly) {
    where.isRead = false;
  }

  return prisma.notification.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });
}

export const getUnreadCount = async (userId: string): Promise<number> => {
  const cacheKey = `${CACHE_PREFIX}user:${userId}:unread`;
  const cached = await cacheGet<number>(cacheKey);
  if (cached !== null) return cached;

  const count = await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });

  await cacheSet(cacheKey, count, 60);

  return count;
}

export const createNotification = async (
  data: NotificationCreateInput
): Promise<Notification> => {
  const notification = await prisma.notification.create({ data });

  await invalidateNotificationCache(notification.userId);

  return notification;
}

export const markAsRead = async (id: string): Promise<Notification> => {
  const notification = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  await invalidateNotificationCache(notification.userId);

  return notification;
}

export const markAllAsRead = async (userId: string): Promise<{ count: number }> => {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: { isRead: true },
  });

  await invalidateNotificationCache(userId);

  return { count: result.count };
}

export const deleteNotification = async (id: string): Promise<Notification> => {
  const notification = await prisma.notification.delete({
    where: { id },
  });

  await invalidateNotificationCache(notification.userId);

  return notification;
}

const invalidateNotificationCache = async (userId: string): Promise<void> => {
  await cacheDel(`${CACHE_PREFIX}user:${userId}:unread`);
}
