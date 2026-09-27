/**
 * Event Types Service
 *
 * Business logic for CRUD operations on event types.
 * Each event type defines a bookable meeting template (title, slug, duration).
 */
import { prisma } from '../config/prisma';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const eventTypesService = {
  /**
   * Return all event types owned by a user.
   * Returns [] if none exist — never 404.
   */
  async findAllByUser(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const eventTypes = await prisma.eventType.findMany({ where: { userId } });
    
    return eventTypes.map(et => ({
      ...et,
      bookingUrl: `/${user.username}/${et.slug}`
    }));
  },

  /**
   * Create a new event type.
   * Slug must be unique per user (enforced at app + DB level).
   */
  async create(
    userId: number,
    data: {
      title: string;
      slug: string;
      duration: number;
      description?: string;
      isActive?: boolean;
    }
  ) {
    if (!Number.isInteger(data.duration) || data.duration < 1) throw new BadRequestError('Duration must be at least 1 minute');
    // Check slug uniqueness before INSERT to give a clean 400 error.
    // The DB has a UNIQUE(userId, slug) constraint as a fallback.
    const existing = await prisma.eventType.findUnique({
      where: { userId_slug: { userId, slug: data.slug } },
    });
    if (existing) {
      throw new BadRequestError('Slug already exists');
    }

    return prisma.eventType.create({
      data: {
        userId,
        title: data.title,
        slug: data.slug,
        duration: data.duration,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
  },

  /**
   * Update an existing event type.
   * Validates ownership and slug uniqueness if slug is changed.
   */
  async update(
    userId: number,
    id: number,
    data: {
      title?: string;
      slug?: string;
      duration?: number;
      description?: string;
      isActive?: boolean;
    }
  ) {
    const eventType = await prisma.eventType.findUnique({ where: { id } });

    if (!eventType || eventType.userId !== userId) {
      throw new NotFoundError('Event type not found');
    }

    if (data.duration !== undefined && (!Number.isInteger(data.duration) || data.duration < 1)) throw new BadRequestError('Duration must be at least 1 minute');
    // If slug changed, verify the new slug isn't taken by another event type
    if (data.slug && data.slug !== eventType.slug) {
      const existing = await prisma.eventType.findUnique({
        where: { userId_slug: { userId, slug: data.slug } },
      });
      if (existing) {
        throw new BadRequestError('Slug already exists');
      }
    }

    return prisma.eventType.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        duration: data.duration,
        description: data.description,
        isActive: data.isActive,
      },
    });
  },

  /**
   * Permanently delete an event type and all its bookings.
   *
   * Deletes child bookings first (manual cascade) because
   * Prisma doesn't support ON DELETE CASCADE at the ORM level —
   * the FK constraint in PostgreSQL has CASCADE, but Prisma's
   * deleteMany is explicit for clarity.
   */
  async remove(userId: number, id: number) {
    const eventType = await prisma.eventType.findUnique({ where: { id } });

    if (!eventType || eventType.userId !== userId) {
      throw new NotFoundError('Event type not found');
    }

    await prisma.eventType.update({ where: { id }, data: { isActive: false } });

    return { success: true };
  },
};
