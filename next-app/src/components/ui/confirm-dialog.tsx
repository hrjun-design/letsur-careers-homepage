"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * 브라우저 네이티브 confirm() 대체용 삭제 확인 모달(2026-09-18) — 웹플로우 CMS의
 * "Exit without saving?" 모달(제목/설명 + 취소·위험 액션 버튼, 화면 중앙 고정)을 참고해
 * 앱 디자인 시스템(Dialog 프리미티브) 위에 재구현. 네이티브 confirm은 브라우저 창 상단에
 * 클릭 위치와 무관하게 떠서 위치·스타일을 못 맞추는 문제가 있었음.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "삭제",
  cancelLabel = "취소",
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 shrink-0 text-destructive" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          {/* 아이콘 너비(size-5=1.25rem) + gap-3(0.75rem) = pl-8(2rem) — 설명을 제목과 같은
              시작선에 맞춤 */}
          <DialogDescription className="pl-8">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
