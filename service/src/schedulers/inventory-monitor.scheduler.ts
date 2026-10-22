import { startInventoryMonitoring } from '@services/inventory/inventory-monitor.service.js';

export const initializeInventoryMonitoring = () => {
  startInventoryMonitoring();
};

export default initializeInventoryMonitoring;
