/**
 * Hooks 入口
 * 
 * @author daod-team
 */

export { useWebSocket } from './useWebSocket';
export { useMap, calculateDistance, getBoundsCenter, isPointInBounds } from './useMap';
export { useTerminals, useTerminalDetail, useSendCommand, getTerminalStatusInfo } from './useTerminal';
export { useVehicles, useVehicleDetail, useVehicleLocation, getVehicleStatusInfo } from './useVehicle';
export { useAlarms, useAlarmDetail, useHandleAlarm, useIgnoreAlarm, getAlarmLevelInfo, getAlarmStatusInfo } from './useAlarm';
export { useNotification } from './useNotification';