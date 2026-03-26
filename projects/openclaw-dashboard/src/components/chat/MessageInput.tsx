/**
 * 消息输入组件 - 智能输入框
 * 
 * 功能：
 * - 多行输入，自动调整高度
 * - 快捷键支持 (Enter 发送, Shift+Enter 换行)
 * - 文件拖拽上传
 * - 字数统计
 * - 发送状态管理
 */

import { useState, useRef, useEffect, useCallback, KeyboardEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageInputProps {
  onSend: (content: string, attachments?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  maxRows?: number;
  agentName?: string;
  agentAvatar?: string;
}

// 支持的文件类型
const ALLOWED_FILE_TYPES = [
  // 图片
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  // 文档
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // 文本
  'text/plain', 'text/markdown', 'text/csv', 'text/html', 'text/css',
  'application/json', 'application/xml',
  // 代码
  'text/javascript', 'application/javascript', 'application/typescript',
  'text/x-python', 'text/x-java', 'text/x-go', 'text/x-rust',
  // 压缩
  'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
  // 音视频
  'audio/mpeg', 'audio/wav', 'audio/ogg',
  'video/mp4', 'video/webm', 'video/quicktime',
];

// 文件大小限制 (20MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = '输入消息... (Enter 发送, Shift+Enter 换行)',
  maxLength = 4000,
  maxRows = 6,
  agentName = '渔晓白',
  agentAvatar = '🦞',
}: MessageInputProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const lineHeight = 24; // 基于样式
      const maxHeight = lineHeight * maxRows;
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [content, maxRows]);

  // 发送消息
  const handleSend = useCallback(() => {
    const trimmedContent = content.trim();
    if (!trimmedContent || disabled) return;

    onSend(trimmedContent, attachments.length > 0 ? attachments : undefined);
    
    // 清空
    setContent('');
    setAttachments([]);
    
    // 重置高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [content, disabled, attachments, onSend]);

  // 键盘事件
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // 文件选择
  // 验证文件
  const validateFiles = useCallback((files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];
    
    for (const file of files) {
      // 检查文件大小
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: 文件过大 (最大 20MB)`);
        continue;
      }
      
      // 检查文件类型 (使用扩展名作为后备)
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isAllowed = ALLOWED_FILE_TYPES.includes(file.type) || 
        // 通过扩展名检查
        ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'doc', 'docx', 
         'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'json', 'csv', 'html', 'css',
         'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'go', 'rs', 'zip', 'rar', '7z',
         'mp3', 'wav', 'ogg', 'mp4', 'webm', 'mov'].includes(ext);
      
      if (!isAllowed && file.type) {
        errors.push(`${file.name}: 不支持的文件类型`);
        continue;
      }
      
      valid.push(file);
    }
    
    return { valid, errors };
  }, []);

  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const { valid, errors } = validateFiles(files);
    
    if (errors.length > 0) {
      setUploadError(errors.join('\n'));
      setTimeout(() => setUploadError(null), 5000);
    }
    
    if (valid.length > 0) {
      setAttachments(prev => [...prev, ...valid]);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [validateFiles]);

  // 拖拽事件
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const { valid, errors } = validateFiles(files);
    
    if (errors.length > 0) {
      setUploadError(errors.join('\n'));
      setTimeout(() => setUploadError(null), 5000);
    }
    
    if (valid.length > 0) {
      setAttachments(prev => [...prev, ...valid]);
    }
  }, [validateFiles]);

  // 移除附件
  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  // 字数统计
  const charCount = content.length;
  const isOverLimit = charCount > maxLength;

  return (
    <div className="p-4 border-t border-white/5" style={{ background: '#0F172A' }}>
      {/* 当前 Agent 提示 */}
      <div className="flex items-center gap-2 mb-3 text-sm text-slate-400">
        <span className="text-lg">{agentAvatar}</span>
        <span>正在与</span>
        <span className="text-cyan-400 font-medium">{agentName}</span>
        <span>对话</span>
      </div>

      {/* 上传错误提示 */}
      <AnimatePresence>
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <span className="text-red-400">⚠️</span>
              <div className="text-sm text-red-300 whitespace-pre-line">{uploadError}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 附件预览 */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-3"
          >
            {attachments.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-white/10"
              >
                <span className="text-sm text-slate-300 truncate max-w-[150px]">
                  {file.name}
                </span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 输入区域 */}
      <div
        className={`
          relative rounded-2xl transition-all duration-200
          ${isFocused ? 'ring-2 ring-cyan-500/50' : ''}
          ${isDragging ? 'ring-2 ring-green-500/50 bg-green-500/5' : ''}
        `}
        style={{ background: isDragging ? undefined : '#1E293B' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* 拖拽提示 */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-slate-800/95 rounded-2xl border-2 border-dashed border-green-500/50 z-10"
            >
              <div className="text-center">
                <p className="text-2xl mb-2">📁</p>
                <p className="text-green-400">释放以添加文件</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2 p-3">
          {/* 文件按钮 */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
            title="添加附件"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.json,.csv,.html,.css,.js,.ts,.jsx,.tsx,.py,.java,.go,.rs,.zip,.rar,.7z,.mp3,.wav,.ogg,.mp4,.webm,.mov"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* 文本输入 */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            rows={1}
            className={`
              flex-1 bg-transparent text-white text-sm resize-none outline-none
              placeholder-slate-500 leading-6
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            style={{ minHeight: '24px', maxHeight: `${maxRows * 24}px` }}
          />

          {/* 字数统计 */}
          {charCount > maxLength * 0.8 && (
            <span className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-slate-500'}`}>
              {charCount}/{maxLength}
            </span>
          )}

          {/* 发送按钮 */}
          <motion.button
            onClick={handleSend}
            disabled={!content.trim() || disabled || isOverLimit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              px-5 py-2 rounded-xl font-medium text-sm transition-all
              ${content.trim() && !disabled && !isOverLimit
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            {disabled ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                发送中
              </span>
            ) : (
              '发送'
            )}
          </motion.button>
        </div>
      </div>

      {/* 快捷键提示 */}
      <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
        <span>Enter 发送 • Shift+Enter 换行</span>
        <span>支持拖拽文件 (图片/文档/代码, 最大20MB)</span>
      </div>
    </div>
  );
}

export default MessageInput;