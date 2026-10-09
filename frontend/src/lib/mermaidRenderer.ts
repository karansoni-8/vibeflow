import mermaid from 'mermaid';

let isInitialized = false;

export function initializeMermaid(): void {
  if (isInitialized) return;

  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'Inter, sans-serif',
    flowchart: {
      useMaxWidth: true,
      htmlLabels: false, // Disable HTML labels to prevent XSS-style parse errors
      curve: 'basis',
      nodeSpacing: 50,
      rankSpacing: 50,
      diagramPadding: 20,
    },
    themeVariables: {
      darkMode: true,
      background: '#0d0d16',
      primaryColor: '#1e1b4b',
      primaryTextColor: '#f4f4f7',
      primaryBorderColor: '#8b5cf6',
      lineColor: '#22d3ee',
      secondaryColor: '#0f172a',
      tertiaryColor: '#1e293b',
      mainBkg: '#131322',
      nodeBorder: '#8b5cf6',
      edgeLabelBackground: '#0d0d16',
    },
  });

  isInitialized = true;
}

/**
 * Sanitize Mermaid code client-side before rendering to prevent
 * "Syntax error in text" crashes from special chars in AI-generated diagrams.
 */
function sanitizeMermaidCode(code: string): string {
  const lines = code.split('\n');
  return lines
    .map((line) => {
      // Keep flowchart header and comments untouched
      if (
        line.trim().startsWith('flowchart') ||
        line.trim().startsWith('graph') ||
        line.trim().startsWith('%%')
      ) {
        return line;
      }

      return (
        line
          // Strip HTML tags
          .replace(/<[^>]+>/g, '')
          // Remove C++ stream operators
          .replace(/<<|>>/g, '')
          // Replace & (HTML entity) with 'and'
          .replace(/&(?!amp;|lt;|gt;|quot;)/g, 'and')
          // Replace double quotes inside node labels with single quotes
          .replace(/([\[{(][^\]})]*?)"/g, "$1'")
          // Remove semicolons inside node labels (Mermaid uses ; as line sep)
          .replace(/([\[(][^\])]*);\s*/g, '$1, ')
          // Replace backticks (template literals)
          .replace(/`/g, "'")
          .trimEnd()
      );
    })
    .join('\n');
}

/**
 * Safe fallback diagram shown when the AI-generated code cannot be parsed.
 */
const FALLBACK_DIAGRAM = `flowchart TD
  Start([Start]) --> Process[Run your algorithm]
  Process --> Cond{Condition?}
  Cond -->|Yes| Output[/Return result/]
  Cond -->|No| Process
  Output --> End([End])`;

export async function renderMermaidSvg(id: string, code: string): Promise<string> {
  initializeMermaid();

  const cleaned = sanitizeMermaidCode(code);

  try {
    const { svg } = await mermaid.render(id, cleaned);
    return svg;
  } catch (firstErr: any) {
    console.warn('Mermaid first-pass error, trying safe fallback diagram...', firstErr?.message);

    // Try the guaranteed-safe fallback diagram
    try {
      const { svg } = await mermaid.render(id + '_fallback', FALLBACK_DIAGRAM);
      return svg;
    } catch (fallbackErr) {
      console.error('Mermaid fallback also failed:', fallbackErr);
      throw firstErr; // Propagate original error to FlowchartPanel
    }
  }
}
