export const SUPABASE_CONSTANTS = {
  STORAGE: {
    UPDATE_FILE: (key: string) => `/object/${key}`,
    READ_FILE: (key: string) => `/object/public/${key}`,
  },
}
export const CLOUD_FILE_FORM_FIELD = '_cloudFile'
