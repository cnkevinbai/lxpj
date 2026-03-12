/**
 * 样式常量
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { Colors } from './Colors'

export const Styles = {
  // 间距
  SPACING: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },

  // 圆角
  RADIUS: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999
  },

  // 字体大小
  FONT_SIZE: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    xxxx: 32
  },

  // 字重
  FONT_WEIGHT: {
    regular: 400,
    medium: 500,
    bold: 700
  },

  // 阴影
  SHADOW: {
    card: {
      radius: 8,
      color: 'rgba(0, 0, 0, 0.05)',
      offsetX: 0,
      offsetY: 2
    },
    float: {
      radius: 16,
      color: 'rgba(0, 0, 0, 0.1)',
      offsetX: 0,
      offsetY: 4
    },
    dialog: {
      radius: 32,
      color: 'rgba(0, 0, 0, 0.15)',
      offsetX: 0,
      offsetY: 8
    }
  },

  // 通用卡片样式
  card: {
    backgroundColor: Colors.BG_CARD,
    borderRadius: Styles.RADIUS.lg,
    padding: Styles.SPACING.lg
  },

  // 通用按钮样式
  button: {
    height: 48,
    borderRadius: Styles.RADIUS.full,
    fontSize: Styles.FONT_SIZE.md,
    fontWeight: Styles.FONT_WEIGHT.medium
  },

  // 通用输入框样式
  input: {
    height: 48,
    backgroundColor: Colors.BG_DISABLED,
    borderRadius: Styles.RADIUS.md,
    padding: { left: 16, right: 16 },
    fontSize: Styles.FONT_SIZE.md
  }
}

export default Styles
