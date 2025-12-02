import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  maxVisiblePages?: number;
  scrollToTop?: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  maxVisiblePages = 8,
  scrollToTop = false,
}) => {
  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const target = Math.max(1, Math.min(page, totalPages));
    onPageChange(target);

    if (scrollToTop && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = (): Array<number | string> => {
    const pages: Array<number | string> = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 5) {
        for (let i = 1; i <= 6; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 4) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 5; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 2; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center mt-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center justify-center w-8 h-8 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {pageNumbers.map((num, i) =>
          num === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="px-3 py-1 text-gray-500 select-none"
            >
              ...
            </span>
          ) : (
            <Button
              key={num}
              size="sm"
              onClick={() => goToPage(Number(num))}
              variant={currentPage === Number(num) ? "default" : "outline"}
              className={cn(
                "w-8 h-8 p-0 rounded-md",
                currentPage === Number(num) &&
                  "bg-primary text-white hover:bg-primary/90"
              )}
            >
              {num}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center justify-center w-8 h-8 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CustomPagination;
