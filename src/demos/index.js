import { PromptStarters, ClarifyingQuestion, VisibleContext, StructuredControls, ContextualNudge, ReplyToPart } from './InputDemos';
import { StreamingResponse, MultipleVariants, RegenerateHistory } from './OutputDemos';
import { EditableOutput, InlineSuggestion, StopAndUndo, PreviewChanges } from './ControlDemos';
import { Citations, ConfidenceSignals, AiDisclosure, SetExpectations, ExplainWhy, MemoryControls, ConnectedApps, BiasCheck } from './TrustDemos';
import { FeedbackLoop, GracefulErrors } from './FeedbackDemos';
import { AutonomyLevels, PauseRedirect, PlanFirst, ActionApproval, TaskStatus, ActionLog, CostEstimate, AgentHandoff, ScreenControl } from './AgentDemos';
import { SandboxPreview } from './SandboxDemo';
import { VoiceTurns, ShowUnderstanding, ReadBack, PointToEdit, ModeSwitch } from './VoiceDemos';

// Maps the `demo` key in patterns.js to its component.
export const demos = {
  PromptStarters,
  ClarifyingQuestion,
  VisibleContext,
  StructuredControls,
  ContextualNudge,
  ReplyToPart,
  StreamingResponse,
  MultipleVariants,
  RegenerateHistory,
  EditableOutput,
  InlineSuggestion,
  StopAndUndo,
  PreviewChanges,
  Citations,
  ConfidenceSignals,
  AiDisclosure,
  SetExpectations,
  ExplainWhy,
  MemoryControls,
  ConnectedApps,
  BiasCheck,
  FeedbackLoop,
  GracefulErrors,
  AutonomyLevels,
  PauseRedirect,
  PlanFirst,
  ActionApproval,
  TaskStatus,
  ActionLog,
  CostEstimate,
  AgentHandoff,
  ScreenControl,
  SandboxPreview,
  VoiceTurns,
  ShowUnderstanding,
  ReadBack,
  PointToEdit,
  ModeSwitch,
};
