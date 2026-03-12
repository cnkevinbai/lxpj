import { Injectable } from '@nestjs/common'

export interface Translation {
  key: string
  translations: Record<string, string> // language -> translation
}

@Injectable()
export class I18nService {
  private translations: Map<string, Translation> = new Map()

  constructor() {
    this.initDefaultTranslations()
  }

  /**
   * 初始化默认翻译
   */
  private initDefaultTranslations() {
    const defaultTranslations: Translation[] = [
      {
        key: 'common.save',
        translations: {
          zh: '保存',
          en: 'Save',
          es: 'Guardar',
          fr: 'Sauvegarder',
          de: 'Speichern',
          ja: '保存',
          ko: '저장',
          ru: 'Сохранить',
          pt: 'Salvar',
          ar: 'حفظ',
        },
      },
      {
        key: 'common.delete',
        translations: {
          zh: '删除',
          en: 'Delete',
          es: 'Eliminar',
          fr: 'Supprimer',
          de: 'Löschen',
          ja: '削除',
          ko: '삭제',
          ru: 'Удалить',
          pt: 'Excluir',
          ar: 'حذف',
        },
      },
      {
        key: 'common.edit',
        translations: {
          zh: '编辑',
          en: 'Edit',
          es: 'Editar',
          fr: 'Modifier',
          de: 'Bearbeiten',
          ja: '編集',
          ko: '편집',
          ru: 'Редактировать',
          pt: 'Editar',
          ar: 'تحرير',
        },
      },
      {
        key: 'common.cancel',
        translations: {
          zh: '取消',
          en: 'Cancel',
          es: 'Cancelar',
          fr: 'Annuler',
          de: 'Abbrechen',
          ja: 'キャンセル',
          ko: '취소',
          ru: 'Отмена',
          pt: 'Cancelar',
          ar: 'إلغاء',
        },
      },
      {
        key: 'common.confirm',
        translations: {
          zh: '确认',
          en: 'Confirm',
          es: 'Confirmar',
          fr: 'Confirmer',
          de: 'Bestätigen',
          ja: '確認',
          ko: '확인',
          ru: 'Подтвердить',
          pt: 'Confirmar',
          ar: 'تأكيد',
        },
      },
      {
        key: 'common.search',
        translations: {
          zh: '搜索',
          en: 'Search',
          es: 'Buscar',
          fr: 'Rechercher',
          de: 'Suchen',
          ja: '検索',
          ko: '검색',
          ru: 'Поиск',
          pt: 'Pesquisar',
          ar: 'بحث',
        },
      },
      {
        key: 'common.loading',
        translations: {
          zh: '加载中...',
          en: 'Loading...',
          es: 'Cargando...',
          fr: 'Chargement...',
          de: 'Laden...',
          ja: '読み込み中...',
          ko: '로딩 중...',
          ru: 'Загрузка...',
          pt: 'Carregando...',
          ar: 'جاري التحميل...',
        },
      },
      {
        key: 'common.success',
        translations: {
          zh: '成功',
          en: 'Success',
          es: 'Éxito',
          fr: 'Succès',
          de: 'Erfolg',
          ja: '成功',
          ko: '성공',
          ru: 'Успех',
          pt: 'Sucesso',
          ar: 'نجاح',
        },
      },
      {
        key: 'common.error',
        translations: {
          zh: '错误',
          en: 'Error',
          es: 'Error',
          fr: 'Erreur',
          de: 'Fehler',
          ja: 'エラー',
          ko: '오류',
          ru: 'Ошибка',
          pt: 'Erro',
          ar: 'خطأ',
        },
      },
      {
        key: 'common.noData',
        translations: {
          zh: '暂无数据',
          en: 'No Data',
          es: 'Sin Datos',
          fr: 'Aucune Donnée',
          de: 'Keine Daten',
          ja: 'データなし',
          ko: '데이터 없음',
          ru: 'Нет Данных',
          pt: 'Sem Dados',
          ar: 'لا توجد بيانات',
        },
      },
    ]

    defaultTranslations.forEach(t => {
      this.translations.set(t.key, t)
    })
  }

  /**
   * 获取翻译
   */
  translate(key: string, language = 'en', defaultValue?: string): string {
    const translation = this.translations.get(key)
    if (!translation) {
      return defaultValue || key
    }

    return translation.translations[language] || translation.translations['en'] || key
  }

  /**
   * 批量获取翻译
   */
  batchTranslate(keys: string[], language = 'en'): Record<string, string> {
    const result: Record<string, string> = {}
    keys.forEach(key => {
      result[key] = this.translate(key, language)
    })
    return result
  }

  /**
   * 添加翻译
   */
  addTranslation(key: string, translations: Record<string, string>): void {
    this.translations.set(key, { key, translations })
  }

  /**
   * 获取所有支持的语言
   */
  getSupportedLanguages(): Array<{ code: string; name: string; nativeName: string }> {
    return [
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    ]
  }
}
