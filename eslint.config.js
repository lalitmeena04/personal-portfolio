import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  { name: 'app/files-to-lint', files: ['**/*.{ts,mts,vue}'] },
  globalIgnores(['dist/**', 'backup/**']),
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  // Formatting is Prettier's job; this turns off the rules that would fight it.
  skipFormatting,
)
