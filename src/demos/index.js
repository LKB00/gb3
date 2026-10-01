import { PromptStarters, ClarifyingQuestion } from './InputDemos';
import { StreamingResponse, MultipleVariants } from './OutputDemos';
import { EditableOutput, InlineSuggestion, StopAndUndo } from './ControlDemos';
import { Citations, ConfidenceSignals, AiDisclosure } from './TrustDemos';
import { FeedbackLoop, GracefulErrors } from './FeedbackDemos';

// Maps the `demo` key in patterns.js to its component.
export const demos = {
  PromptStarters,
  ClarifyingQuestion,
  StreamingResponse,
  MultipleVariants,
  EditableOutput,
  InlineSuggestion,
  StopAndUndo,
  Citations,
  ConfidenceSignals,
  AiDisclosure,
  FeedbackLoop,
  GracefulErrors,
};
