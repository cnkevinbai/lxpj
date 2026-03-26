/**
 * 工具函数入口
 * 
 * @author daod-team
 */

export * from './request';
export * from './storage';
export * from './format';
export * from './date';
export * from './permission';

// 导出默认对象
import request from './request';
import storage from './storage';
import * as format from './format';
import * as date from './date';
import * as permission from './permission';

export default {
  request,
  storage,
  format,
  date,
  permission,
};