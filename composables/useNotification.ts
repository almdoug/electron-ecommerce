import { ref } from 'vue';

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
   * Adiciona uma nova notificação
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
   * Remove uma notificação pelo ID
   */
  const remove = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };

  /**
   * Adiciona uma notificação de sucesso
   */
  const success = (message: string, duration = 3000) => {
    return add(message, 'success', duration);
  };

  /**
   * Adiciona uma notificação de erro
   */
  const error = (message: string, duration = 3000) => {
    return add(message, 'error', duration);
  };

  /**
   * Adiciona uma notificação de aviso
   */
  const warning = (message: string, duration = 3000) => {
    return add(message, 'warning', duration);
  };

  /**
   * Adiciona uma notificação informativa
   */
  const info = (message: string, duration = 3000) => {
    return add(message, 'info', duration);
  };

  /**
   * Remove todas as notificações
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