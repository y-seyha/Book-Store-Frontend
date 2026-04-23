"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type DropdownProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
};

export default function RowDropdown({
                                      onEdit,
                                      onDelete,
                                      editLabel,
                                      deleteLabel,
                                    }: DropdownProps) {
  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            •••
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                {editLabel ?? "Edit"}
              </DropdownMenuItem>
          )}

          {onDelete && (
              <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-500"
              >
                {deleteLabel ?? "Delete"}
              </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
  );
}