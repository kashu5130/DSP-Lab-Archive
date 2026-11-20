export type ExperimentCategory =
  | 'signals-convolution'
  | 'transforms-zdomain'
  | 'filters-multirate'
  | 'custom';

export type FilterCategory = 'all' | ExperimentCategory;

export interface ExperimentFile {
  id: string;
  number: number;
  title: string;
  filename: string;
  sourcePages: string;
  category: ExperimentCategory;
  categoryLabel: string;
  software: string;
  aim: string;
  theory: string[];
  expectedResult: string;
  codeNote?: string;
  code: string;
  isCustom?: boolean;
}

export interface LabManualInfo {
  title: string;
  subtitle: string;
  pdfPath: string;
  downloadName: string;
  totalPages: number;
  softwareVersion: string;
  notes: string[];
  codeReviewSummary: string[];
}
