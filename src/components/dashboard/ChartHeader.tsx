import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ChartHeader = () => {
  const options = [
    "Last 24 Hours",
    "Last 7 Days",
    "Last 30 Days",
    "Custom Range",
  ];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  // dates
  const [startDate, setStartDate] = useState<string>("2025-09-02");
  const [endDate, setEndDate] = useState<string>("2025-09-03");

  // refs for native date inputs
  const startInputRef = useRef<HTMLInputElement | null>(null);
  const endInputRef = useRef<HTMLInputElement | null>(null);

  // wrapper ref covers the time-range dropdown (keeps previous outside-click behavior)
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function formatDisplay(dateStr?: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  // helper to reliably open native date picker
  type DateInputWithShowPicker = HTMLInputElement & { showPicker?: () => void };
  const openNativePicker = (input: HTMLInputElement | null) => {
    if (!input) return;
    const pickable = input as DateInputWithShowPicker;
    try {
      // prefer the modern API
      if (typeof pickable.showPicker === "function") {
        pickable.showPicker();
        return;
      }
      // fallback: focus + click (works when input is focusable/visible in layout)
      input.focus();
      input.click();
    } catch {
      // last resort
      input.focus();
      input.click();
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Revenue & Monetization
        </h3>
        <p className="text-gray-300 text-sm">
          An overview of Aura&apos;s financial performance.
        </p>
      </div>
      {/* wrapper for dropdown + date inputs */}
      <div className="flex items-center space-x-2" ref={wrapperRef}>
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setOpen((s) => !s)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="border-gray-400 py-6 text-gray-50 bg-[#7C8B93] hover:bg-gray-400 flex items-center space-x-2"
          >
            <span>{selected}</span>
            <ChevronDown
              className={`w-4 h-4 transform ${open ? "rotate-180" : ""}`}
            />
          </Button>

          {open && (
            <div
              role="menu"
              aria-label="Time range"
              className="absolute right-0 mt-2 w-48 bg-[#0f1724] text-gray-100 rounded shadow-lg ring-1 ring-black/20 z-50"
            >
              {options.map((opt) => (
                <button
                  key={opt}
                  role="menuitem"
                  onClick={() => {
                    setSelected(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                    opt === selected ? "font-semibold bg-gray-800" : ""
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* date buttons that open native calendar directly */}
        <div className="flex items-center space-x-2 relative">
          {/* Start date button -> triggers native picker on hidden input */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => openNativePicker(startInputRef.current)}
              className="border-gray-400 text-gray-50 py-6 hover:bg-gray-400 bg-[#7C8B93] flex items-center space-x-2 "
            >
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDisplay(startDate)}</span>
            </Button>

            {/* invisible but focusable native date input placed inside the same relative container */}
            <input
              ref={startInputRef}
              type="date"
              aria-label="Start date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              // keep in layout but invisible so programmatic click works across browsers
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 1,
                height: 1,
                opacity: 0,
                pointerEvents: "auto",
              }}
            />
          </div>

          {/* End date button -> triggers native picker on hidden input */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => openNativePicker(endInputRef.current)}
              className="border-gray-400 text-gray-50 py-6 hover:bg-gray-400 bg-[#7C8B93] flex items-center space-x-2"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDisplay(endDate)}</span>
            </Button>

            {/* invisible but focusable native date input */}
            <input
              ref={endInputRef}
              type="date"
              aria-label="End date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 1,
                height: 1,
                opacity: 0,
                pointerEvents: "auto",
              }}
            />
          </div>

          <Button
            className="hover:bg-gray-400 bg-[#7C8B93] text-white px-4  py-6"
            onClick={() => {
              // mark selection as custom range when apply is clicked
              setSelected("Custom Range");
              setOpen(false);
            }}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChartHeader;
