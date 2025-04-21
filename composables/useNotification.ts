export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  duration?: number;
}

export const useNotification = () => {
  const notifications = ref<Notification[]>([]);
  let nextId = 0;

  /**
   * Add a new notification
   */
  const add = (message: string, type: NotificationType = 'info', duration = 3000) => {
    const id = nextId++;
    const notification: Notification = {
      id,
      message,
      type,
      duration
    };

    notifications.value.push(notification);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  };

  /**
   * Remove a notification by ID
   */
  const remove = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };

  /**
   * Add a success notification
   */
  const success = (message: string, duration = 3000) => {
    return add(message, 'success', duration);
  };

  /**
   * Add an error notification
   */
  const error = (message: string, duration = 3000) => {
    return add(message, 'error', duration);
  };

  /**
   * Add a warning notification
   */
  const warning = (message: string, duration = 3000) => {
    return add(message, 'warning', duration);
  };

  /**
   * Add an info notification
   */
  const info = (message: string, duration = 3000) => {
    return add(message, 'info', duration);
  };

  /**
   * Clear all notifications
   */
  const clear = () => {
    notifications.value = [];
  };

  return {
    notifications,
    add,
    remove,
    success,
    error,
    warning,
    info,
    clear
  };
}; 