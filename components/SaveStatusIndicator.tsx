import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

/* ✓ icon – 18 px */
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} {...props}>
      <path
        d="M7 13.5l3 3 7-7"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* Shows spinner while saving, then green ✓ for 2 s when done */
export default function SaveStatusIndicator({ saving }: { saving: boolean }) {
  // No showSaved state needed since checkmark is always shown when not saving
  React.useEffect(() => {}, [saving]); // placeholder if you want to add effects

  if (saving) {
    // Use a dark neutral for spinner in light mode, white in dark mode
    // shadcn/ui uses oklch(0.22 0 0) for foreground in light, oklch(1 0 0) for dark
    // We'll use #222 for light, #fff for dark
    return (
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 300ms ease",
          backgroundColor: "transparent"
        }}
      >
        <CircularProgress
          size={31}
          thickness={4}
          sx={{
            color: 'var(--spinner-color, #222)',
          }}
        />
        <style>{`
          html.dark .MuiCircularProgress-root {
            --spinner-color: #fff !important;
          }
          html:not(.dark) .MuiCircularProgress-root {
            --spinner-color: #222 !important;
          }
        `}</style>
      </Box>
    );
  }
  // Always show green checkmark when not saving
  return (
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 300ms ease",
        backgroundColor: "success.main"
      }}
    >
      <CheckIcon style={{ color: "#fff", width: 25, height: 25 }} />
    </Box>
  );
}
