// Pre-commit для Python: линтер и форматтер ruff по изменённым .py файлам.
// Запускается из общего хука frontend/.husky/pre-commit через lint-staged.
import { fileURLToPath } from 'node:url'

const ruff = fileURLToPath(new URL('../scripts/ruff.sh', import.meta.url))

export default {
  '*.py': [`sh "${ruff}" check --fix`, `sh "${ruff}" format`],
}
