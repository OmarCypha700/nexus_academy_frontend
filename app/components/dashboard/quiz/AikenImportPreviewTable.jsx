"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";

const TYPE_LABELS = {
  multiple_choice_single: "Single choice",
  multiple_choice_multiple: "Multi choice",
  true_false: "True/False",
  short_answer: "Short answer",
};

export default function AikenImportPreviewTable({ rows }) {
  return (
    <div className="border rounded-lg overflow-hidden max-h-72 overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background">
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Question</TableHead>
            <TableHead className="w-32">Type</TableHead>
            <TableHead className="w-14">Pts</TableHead>
            <TableHead className="w-24">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.row}>
              <TableCell className="text-muted-foreground align-top">{row.row}</TableCell>
              <TableCell className="whitespace-normal align-top">
                <div className="font-mono text-xs">{row.text || "—"}</div>
                {row.status === "error" && row.errors?.length > 0 && (
                  <p className="text-xs text-destructive mt-1">{row.errors.join(" ")}</p>
                )}
              </TableCell>
              <TableCell className="text-xs align-top">
                {TYPE_LABELS[row.question_type] || row.question_type || "—"}
              </TableCell>
              <TableCell className="text-xs align-top">{row.points ?? "—"}</TableCell>
              <TableCell className="align-top">
                {row.status === "valid" ? (
                  <Badge className="bg-green-600 hover:bg-green-600 text-white border-transparent">
                    Valid
                  </Badge>
                ) : (
                  <Badge variant="destructive">Error</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
