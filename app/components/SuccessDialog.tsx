import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Typography
} from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import type { FormData } from "../wizardTypes";
import { securityLevels, workspaceTypes } from "../wizardConfig";

type SuccessDialogProps = {
  open: boolean;
  onClose: () => void;
  formData: FormData;
};

const SuccessPulseIcon = () => (
  <Box
    sx={{
      width: 72,
      height: 72,
      borderRadius: "50%",
      bgcolor: "success.light",
      color: "success.main",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 2,
      mx: "auto",
      position: "relative",
      boxShadow: "0 12px 30px rgba(34, 197, 94, 0.25)",
      "@keyframes pulseRing": {
        "0%": { transform: "scale(0.9)", opacity: 0.5 },
        "70%": { transform: "scale(1.25)", opacity: 0 },
        "100%": { transform: "scale(1.25)", opacity: 0 }
      },
      "&::after": {
        content: '""',
        position: "absolute",
        width: 72,
        height: 72,
        borderRadius: "50%",
        border: "2px solid",
        borderColor: "success.main",
        animation: "pulseRing 1.6s ease-out infinite"
      }
    }}
  >
    <CheckCircleIcon sx={{ fontSize: 36 }} />
  </Box>
);

const SuccessDialog = ({ open, onClose, formData }: SuccessDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="workspace-created-title"
      fullWidth
      maxWidth="sm"
      TransitionComponent={Fade}
      transitionDuration={250}
      PaperProps={{
        sx: {
          borderRadius: 4,
          px: { xs: 1, sm: 2 },
          py: 1
        }
      }}
    >
      <DialogTitle id="workspace-created-title">Workspace created</DialogTitle>
      <DialogContent dividers>
        <SuccessPulseIcon />
        <Typography variant="body1" gutterBottom align="center">
          Your workspace was created successfully. Here’s a quick summary:
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body2">
              {formData.workspaceName || "Untitled Workspace"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Type
            </Typography>
            <Typography variant="body2">
              {workspaceTypes.find((type) => type.value === formData.workspaceType)?.label}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Admin
            </Typography>
            <Typography variant="body2">{formData.adminEmail}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Security
            </Typography>
            <Typography variant="body2">
              {securityLevels.find((level) => level.value === formData.securityLevel)?.label}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;
