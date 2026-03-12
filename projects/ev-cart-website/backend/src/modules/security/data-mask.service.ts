import { Injectable, Logger } from '@nestjs/common';

/**
 * 数据脱敏服务
 * 保护敏感数据不被泄露
 */
@Injectable()
export class DataMaskService {
  private readonly logger = new Logger(DataMaskService.name);

  /**
   * 脱敏手机号
   */
  maskPhone(phone: string, showLast: number = 4): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 7) return cleaned;
    return cleaned.substring(0, 3) + '****' + cleaned.substring(cleaned.length - showLast);
  }

  /**
   * 脱敏邮箱
   */
  maskEmail(email: string): string {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;

    const maskedUsername =
      username.length <= 2
        ? username[0] + '*'
        : username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];

    return `${maskedUsername}@${domain}`;
  }

  /**
   * 脱敏身份证
   */
  maskIdCard(idCard: string): string {
    if (!idCard) return '';
    const cleaned = idCard.replace(/\D/g, '');
    if (cleaned.length < 10) return idCard;
    return cleaned.substring(0, 6) + '********' + cleaned.substring(cleaned.length - 4);
  }

  /**
   * 脱敏银行卡
   */
  maskBankCard(bankCard: string): string {
    if (!bankCard) return '';
    const cleaned = bankCard.replace(/\D/g, '');
    if (cleaned.length < 8) return bankCard;
    return '**** **** **** ' + cleaned.substring(cleaned.length - 4);
  }

  /**
   * 脱敏姓名
   */
  maskName(name: string): string {
    if (!name) return '';
    if (name.length <= 2) return name[0] + '*';
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  }

  /**
   * 脱敏地址
   */
  maskAddress(address: string, keepLevel: number = 2): string {
    if (!address) return '';
    const parts = address.split(/[省市区县]/);
    if (parts.length <= keepLevel) return address;
    return parts.slice(0, keepLevel).join('') + '****';
  }

  /**
   * 智能脱敏（根据字段类型自动选择脱敏方式）
   */
  maskByField(field: string, value: string): string {
    if (!value) return value;

    const fieldName = field.toLowerCase();

    if (fieldName.includes('phone') || fieldName.includes('mobile') || fieldName.includes('tel')) {
      return this.maskPhone(value);
    }

    if (fieldName.includes('email') || fieldName.includes('mail')) {
      return this.maskEmail(value);
    }

    if (fieldName.includes('idcard') || fieldName.includes('identity')) {
      return this.maskIdCard(value);
    }

    if (fieldName.includes('bank') || fieldName.includes('card')) {
      return this.maskBankCard(value);
    }

    if (fieldName.includes('name') && fieldName.includes('user')) {
      return this.maskName(value);
    }

    if (fieldName.includes('address') || fieldName.includes('addr')) {
      return this.maskAddress(value);
    }

    // 默认不脱敏
    return value;
  }

  /**
   * 批量脱敏对象
   */
  maskObject(obj: any, maskFields?: string[]): any {
    if (!obj) return obj;

    const result = { ...obj };
    const fieldsToMask = maskFields || Object.keys(obj);

    for (const field of fieldsToMask) {
      if (obj[field] && typeof obj[field] === 'string') {
        result[field] = this.maskByField(field, obj[field]);
      }
    }

    return result;
  }

  /**
   * 批量脱敏数组
   */
  maskArray(arr: any[], maskFields?: string[]): any[] {
    if (!arr) return [];
    return arr.map((item) => this.maskObject(item, maskFields));
  }

  /**
   * 根据用户权限决定是否脱敏
   */
  maskByPermission(data: any, userRole: string, sensitiveFields: string[]): any {
    // 管理员和超级管理员不脱敏
    if (userRole === 'admin' || userRole === 'super_admin') {
      return data;
    }

    // 普通用户脱敏
    if (Array.isArray(data)) {
      return this.maskArray(data, sensitiveFields);
    }

    return this.maskObject(data, sensitiveFields);
  }
}
