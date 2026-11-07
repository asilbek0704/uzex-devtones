import type { HTMLAttributes } from 'react'

const style = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const

/** Текст только для скринридеров */
export function VisuallyHidden(props: HTMLAttributes<HTMLSpanElement>) {
  return <span style={style} {...props} />
}
