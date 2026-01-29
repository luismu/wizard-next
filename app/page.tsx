"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon
} from "@mui/icons-material";
import type {
  FeatureKey,
  FormData,
  IntegrationId,
  SecurityLevel,
  TeamSize,
  WorkspaceType
} from "./wizardTypes";
import {
  EMAIL_REGEX,
  availableIntegrations,
  featureDescriptions,
  initialFormData,
  securityLevels,
  stepIcons,
  steps,
  teamSizes,
  workspaceTypes
} from "./wizardConfig";
import SuccessDialog from "./components/SuccessDialog";

const formatFeatureLabel = (feature: FeatureKey) =>
  feature
    .split(/(?=[A-Z])/)
    .join(" ")
    .replace(/^\w/, (char) => char.toUpperCase());

const iconLookup = {
  business: <BusinessIcon key="business" />,
  group: <GroupIcon key="group" />,
  settings: <SettingsIcon key="settings" />,
  security: <SecurityIcon key="security" />,
  check: <CheckCircleIcon key="check" />
};

const getStepIcon = (index: number) => iconLookup[stepIcons[index]] ?? null;

const CustomStepIcon = (props: { active?: boolean; completed?: boolean; icon?: React.ReactNode }) => {
  const { active, completed, icon } = props;
  const color = completed ? "success.main" : active ? "primary.main" : "text.primary";

  return (
    <Box
      sx={{
        width: { xs: 30, sm: 36 },
        height: { xs: 30, sm: 36 },
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.paper",
        border: 2,
        borderColor: color,
        color,
        "& svg": { fontSize: { xs: 16, sm: 20 } },
        "@keyframes pulseRing": {
          "0%": { transform: "scale(0.9)", opacity: 0.4 },
          "70%": { transform: "scale(1.25)", opacity: 0 },
          "100%": { transform: "scale(1.25)", opacity: 0 }
        },
        "&::after": active && !completed ? {
          content: '""',
          position: "absolute",
          inset: -4,
          borderRadius: "50%",
          border: "2px solid",
          borderColor: "primary.main",
          animation: "pulseRing 1.6s ease-out infinite"
        } : undefined,
        position: "relative"
      }}
    >
      {icon}
    </Box>
  );
};

const WorkspaceWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const stepCount = steps.length;
  const progressValue = useMemo(() => {
    if (stepCount <= 1) {
      return 0;
    }
    return Math.round((activeStep / (stepCount - 1)) * 100);
  }, [activeStep, stepCount]);

  const handleInputChange = useCallback(
    <Key extends keyof FormData>(field: Key, value: FormData[Key]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value
      }));
    },
    []
  );

  const handleFeatureToggle = useCallback((feature: FeatureKey) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  }, []);

  const handleIntegrationToggle = useCallback((integrationId: IntegrationId) => {
    setFormData((prev) => {
      const currentIntegrations = prev.integrations.includes(integrationId)
        ? prev.integrations.filter((id) => id !== integrationId)
        : [...prev.integrations, integrationId];

      return {
        ...prev,
        integrations: currentIntegrations
      };
    });
  }, []);

  const handleAvatarUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback(() => {
    console.log("Form submitted:", formData);
    setIsSuccessOpen(true);
  }, [formData]);

  const handleNext = useCallback(() => {
    if (activeStep === stepCount - 1) {
      handleSubmit();
      return;
    }

    setActiveStep((prev) => prev + 1);
  }, [activeStep, handleSubmit, stepCount]);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setIsSuccessOpen(false);
  }, []);

  const isStepComplete = useCallback(
    (step: number) => {
      switch (step) {
        case 0:
          return formData.workspaceName.trim() !== "";
        case 1:
          return formData.adminEmail !== "" && EMAIL_REGEX.test(formData.adminEmail);
        case 2:
          return true;
        case 3:
          return true;
        case 4:
          return true;
        default:
          return false;
      }
    },
    [formData]
  );

  const enabledFeatures = useMemo(
    () => Object.entries(formData.features).filter((entry) => entry[1]) as [FeatureKey, boolean][],
    [formData.features]
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Workspace Information
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Let's start by setting up the basic information about your workspace.
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box sx={{ position: "relative", mr: 2 }}>
                <Avatar sx={{ width: 80, height: 80 }} src={formData.avatarPreview}>
                  {formData.workspaceName?.charAt(0) || "W"}
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarUpload}
                />
                <label htmlFor="avatar-upload">
                  <IconButton
                    aria-label="Upload workspace logo"
                    component="span"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" }
                    }}
                  >
                    <CloudUploadIcon sx={{ color: "white", fontSize: 16 }} />
                  </IconButton>
                </label>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Upload a workspace logo (optional)
                </Typography>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Workspace Name"
              value={formData.workspaceName}
              onChange={(event) => handleInputChange("workspaceName", event.target.value)}
              margin="normal"
              required
              helperText="Choose a descriptive name for your workspace"
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(event) => handleInputChange("description", event.target.value)}
              margin="normal"
              multiline
              rows={3}
              helperText="Briefly describe the purpose of this workspace"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Workspace Type</InputLabel>
              <Select
                value={formData.workspaceType}
                label="Workspace Type"
                onChange={(event) =>
                  handleInputChange("workspaceType", event.target.value as WorkspaceType)
                }
              >
                {workspaceTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Team Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configure settings based on your team size and needs.
            </Typography>

            <FormControl component="fieldset" sx={{ width: "100%", mt: 2 }}>
              <RadioGroup
                value={formData.teamSize}
                onChange={(event) =>
                  handleInputChange("teamSize", event.target.value as TeamSize)
                }
              >
                {teamSizes.map((size) => (
                  <Card
                    key={size.value}
                    sx={{
                      mb: 2,
                      border: formData.teamSize === size.value ? "2px solid" : "1px solid",
                      borderColor:
                        formData.teamSize === size.value ? "primary.main" : "divider",
                      cursor: "pointer"
                    }}
                    onClick={() => handleInputChange("teamSize", size.value)}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Radio value={size.value} checked={formData.teamSize === size.value} />
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="subtitle1">{size.label}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {size.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="Primary Admin Email"
              type="email"
              value={formData.adminEmail}
              onChange={(event) => handleInputChange("adminEmail", event.target.value)}
              margin="normal"
              required
              helperText="The primary administrator for this workspace"
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Features & Integrations
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Select the features and integrations you want to enable.
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Core Features
              </Typography>
              <FormGroup>
                {Object.entries(formData.features).map(([key, value]) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        checked={value}
                        onChange={() => handleFeatureToggle(key as FeatureKey)}
                      />
                    }
                    label={
                      <Box>
                        <Typography>{formatFeatureLabel(key as FeatureKey)}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {featureDescriptions[key as FeatureKey]}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Third-party Integrations
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Connect your favorite tools (optional)
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {availableIntegrations.map((integration) => (
                  <Chip
                    key={integration.id}
                    label={`${integration.icon} ${integration.name}`}
                    onClick={() => handleIntegrationToggle(integration.id)}
                    color={formData.integrations.includes(integration.id) ? "primary" : "default"}
                    variant={
                      formData.integrations.includes(integration.id) ? "filled" : "outlined"
                    }
                    sx={{ height: "auto", py: 1 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configure security preferences for your workspace.
            </Typography>

            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <RadioGroup
                value={formData.securityLevel}
                onChange={(event) =>
                  handleInputChange("securityLevel", event.target.value as SecurityLevel)
                }
              >
                {securityLevels.map((level) => (
                  <Card
                    key={level.value}
                    sx={{
                      mb: 2,
                      border:
                        formData.securityLevel === level.value ? "2px solid" : "1px solid",
                      borderColor:
                        formData.securityLevel === level.value ? "primary.main" : "divider",
                      cursor: "pointer"
                    }}
                    onClick={() => handleInputChange("securityLevel", level.value)}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Radio
                          value={level.value}
                          checked={formData.securityLevel === level.value}
                        />
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="subtitle1">{level.label}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {level.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
            </FormControl>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> Security settings can be adjusted later in workspace
                settings. We recommend starting with "Standard" for most use cases.
              </Typography>
            </Alert>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review & Create Workspace
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please review all settings before creating your workspace.
            </Typography>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Workspace Summary
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar src={formData.avatarPreview} sx={{ mr: 2 }}>
                    {formData.workspaceName?.charAt(0) || "W"}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {formData.workspaceName || "Untitled Workspace"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {
                        workspaceTypes.find((type) => type.value === formData.workspaceType)
                          ?.label
                      }
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body2">
                      {formData.description || "No description provided"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Team Size
                    </Typography>
                    <Typography variant="body2">
                      {teamSizes.find((size) => size.value === formData.teamSize)?.label}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Admin Email
                    </Typography>
                    <Typography variant="body2">{formData.adminEmail}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Security Level
                    </Typography>
                    <Typography variant="body2">
                      {securityLevels.find((level) => level.value === formData.securityLevel)?.label}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Enabled Features
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                    {enabledFeatures.map(([feature]) => (
                      <Chip key={feature} label={formatFeatureLabel(feature)} size="small" />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Integrations
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                    {formData.integrations.map((id) => {
                      const integration = availableIntegrations.find((item) => item.id === id);
                      return integration ? (
                        <Chip
                          key={id}
                          label={`${integration.icon} ${integration.name}`}
                          size="small"
                        />
                      ) : null;
                    })}
                    {formData.integrations.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No integrations selected
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Alert severity="success">
              <Typography variant="body2">
                Your workspace is ready to be created! Click "Create Workspace" to finish.
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Collapse in={activeStep === 0} timeout={300} unmountOnExit>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Workspace Setup Wizard
        </Typography>

        <Typography variant="body1" paragraph align="center" color="text.secondary">
          Follow these simple steps to configure your new project workspace
        </Typography>
      </Collapse>

      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          bgcolor: "background.default",
          pt: 2,
          pb: 2,
          boxShadow: { xs: "0 6px 16px rgba(0,0,0,0.08)", sm: "none" }
        }}
      >
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mt: 1,
            mb: 2,
            flexWrap: "wrap",
            "& .MuiStep-root": { minWidth: 0, flex: "1 1 20%" },
            "& .MuiStepLabel-label": {
              mt: 1,
              fontSize: { xs: "0.6rem", sm: "0.875rem" },
              lineHeight: 1.2,
              textAlign: "center",
              whiteSpace: "normal",
              px: { xs: 0.5, sm: 1 }
            },
          "& .MuiStepLabel-label.Mui-completed": { color: "success.main" },
          "& .MuiStepLabel-label.Mui-active": { color: "primary.main", fontWeight: 600 },
          "& .MuiStepLabel-label.Mui-disabled": { color: "text.primary" }
          }}
        >
          {steps.map((label, index) => (
            <Step key={label} completed={index < activeStep && isStepComplete(index)}>
              <StepLabel StepIconComponent={CustomStepIcon} icon={getStepIcon(index)}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ px: { xs: 1, sm: 4 } }}>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 8,
              borderRadius: 999,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999
              }
            }}
          />
        </Box>
      </Box>

      <Card sx={{ overflow: "visible" }}>
        <CardContent sx={{ pb: 10 }}>
          {renderStepContent(activeStep)}
          {activeStep < stepCount - 1 && null}
        </CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: 1,
            borderColor: "divider",
            position: "sticky",
            bottom: 0,
            bgcolor: "background.paper",
            zIndex: 1,
            px: { xs: 2, sm: 3 },
            py: 2,
            boxShadow: "0 -8px 20px rgba(0,0,0,0.08)"
          }}
        >
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={activeStep === stepCount - 1 ? <CheckCircleIcon /> : <ArrowForwardIcon />}
            disabled={!isStepComplete(activeStep)}
          >
            {activeStep === stepCount - 1 ? "Create Workspace" : "Continue"}
          </Button>
        </Box>
      </Card>

      <SuccessDialog
        open={isSuccessOpen}
        onClose={handleCloseSuccess}
        formData={formData}
      />
    </Container>
  );
};

export default WorkspaceWizard;
