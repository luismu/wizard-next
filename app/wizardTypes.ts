export type WorkspaceType =
  | "development"
  | "design"
  | "marketing"
  | "support"
  | "research";

export type TeamSize = "small" | "medium" | "large" | "enterprise";

export type SecurityLevel = "basic" | "standard" | "strict";

export type FeatureKey = "versionControl" | "ciCd" | "monitoring" | "collaboration";

export type IntegrationId = "github" | "slack" | "jira" | "figma" | "notion" | "zoom";

export type FormData = {
  workspaceName: string;
  description: string;
  workspaceType: WorkspaceType;
  teamSize: TeamSize;
  features: Record<FeatureKey, boolean>;
  securityLevel: SecurityLevel;
  adminEmail: string;
  integrations: IntegrationId[];
  avatar: File | null;
  avatarPreview: string;
};
