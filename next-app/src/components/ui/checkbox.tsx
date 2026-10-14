"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon, MinusIcon } from "lucide-react"
import { cn } from "cn"

// shadcn base(Base UI) Checkbox — https://ui.shadcn.com/docs/components/base/checkbox (2026-10-14 추가).
// 원본에 더해 `indeterminate`(일부 선택) 상태일 땐 체크 대신 가로줄 아이콘을 보여준다(전체 선택 헤더용).
function Checkbox({ className, indeterminate, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      indeterminate={indeterminate}
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input bg-white shadow-xs transition-shadow outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        {indeterminate ? <MinusIcon /> : <CheckIcon />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
