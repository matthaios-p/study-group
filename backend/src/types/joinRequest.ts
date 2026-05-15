/**
 * Join Request Types
 *
 * Defines TypeScript interfaces for group join requests and related data.
 */

/**
 * Represents a pending join request
 */
export interface JoinRequestRecord {
  id: string;
  groupId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  resolvedAt?: string;
  coordinatorId?: string;
}

/**
 * Join request from frontend
 */
export interface JoinRequestPayload {
  userId: string;
}

/**
 * Join response to frontend
 */
export interface JoinResponsePayload {
  message: string;
  status: 'approved' | 'pending';
  requestId?: string;
  coordinatorNotification?: string;
}

/**
 * Coordinator notification
 */
export interface CoordinatorNotification {
  id: string;
  coordinatorId: string;
  groupId: string;
  userId: string;
  type: 'join_request';
  message: string;
  createdAt: string;
  read: boolean;
}
