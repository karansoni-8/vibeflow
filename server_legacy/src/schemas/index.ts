import { z } from 'zod';

export const ExecuteCodeSchema = z.object({
  language: z.enum(['cpp', 'python', 'javascript', 'java']),
  code: z.string().min(1).max(65536),
  stdin: z.string().max(32768).optional().default(''),
});

export const GenerateCodeSchema = z.object({
  prompt: z.string().min(1),
  language: z.string(),
  beginnerMode: z.boolean().optional(),
});

export const ExplainCodeSchema = z.object({
  code: z.string(),
  language: z.string(),
  beginnerMode: z.boolean().optional(),
});

export const ExplainLineSchema = z.object({
  code: z.string(),
  lineNumber: z.number(),
  language: z.string(),
  beginnerMode: z.boolean().optional(),
});

export const ImproveCodeSchema = z.object({
  code: z.string(),
  language: z.string(),
});

export const ComplexitySchema = z.object({
  code: z.string(),
  language: z.string(),
  input: z.string().optional(),
});

export const ErrorExplainSchema = z.object({
  code: z.string(),
  language: z.string(),
  stderr: z.string(),
  stdout: z.string(),
  exitCode: z.number(),
  input: z.string().optional(),
});

export const FlowchartSchema = z.object({
  code: z.string(),
  language: z.string(),
});

export const TestCaseSchema = z.object({
  code: z.string(),
  language: z.string(),
});

export const ChatSchema = z.object({
  message: z.string(),
  context: z.object({
    code: z.string().optional(),
    language: z.string().optional(),
    selectedCode: z.string().optional(),
    errors: z.string().optional(),
    input: z.string().optional(),
  }).optional(),
  beginnerMode: z.boolean().optional(),
});

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  language: z.string(),
});

export const CreateFileSchema = z.object({
  name: z.string().min(1).max(100),
  language: z.string(),
  content: z.string().optional(),
});

export const UpdateFileSchema = z.object({
  content: z.string(),
});

export const FlowchartResponseSchema = z.object({
  nodes: z.array(z.object({
    id: z.string(),
    type: z.string(),
    label: z.string(),
    lineStart: z.number().optional(),
    lineEnd: z.number().optional(),
  })),
  edges: z.array(z.object({
    source: z.string(),
    target: z.string(),
    label: z.string().optional(),
  })),
});
