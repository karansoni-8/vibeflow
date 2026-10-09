export function parseControlFlow(code, language) {
    const lines = code.split('\n');
    const nodes = [];
    const edges = [];
    let nodeIdCounter = 1;
    function nextId(prefix) {
        return `${prefix}_${nodeIdCounter++}`;
    }
    // Always start with START node
    const startId = nextId('start');
    nodes.push({
        id: startId,
        type: 'start',
        label: 'START',
        lineStart: 1,
        lineEnd: 1,
        description: 'Program Entry Point',
    });
    let previousNodeId = startId;
    // Simple, robust line-by-line control flow analyzer
    let i = 0;
    while (i < lines.length) {
        const rawLine = lines[i];
        const line = rawLine.trim();
        const lineNum = i + 1;
        // Skip empty lines, preprocessor directives, comments
        if (!line ||
            line.startsWith('#include') ||
            line.startsWith('using ') ||
            line.startsWith('//') ||
            line.startsWith('#') ||
            line === '{' ||
            line === '}') {
            i++;
            continue;
        }
        // Check for loops (for, while)
        const forMatch = line.match(/^for\s*\((.*?)\)/);
        const whileMatch = line.match(/^while\s*\((.*?)\)/);
        const pyWhileMatch = line.match(/^while\s+(.*?):/);
        const pyForMatch = line.match(/^for\s+(.*?):/);
        if (forMatch || whileMatch || pyWhileMatch || pyForMatch) {
            const condition = forMatch ? forMatch[1] : whileMatch ? whileMatch[1] : pyWhileMatch ? pyWhileMatch[1] : pyForMatch[1];
            const decisionId = nextId('loop_dec');
            const processId = nextId('loop_body');
            // Edge from previous to loop decision
            edges.push({
                id: `e_${previousNodeId}_${decisionId}`,
                source: previousNodeId,
                target: decisionId,
            });
            // Loop Decision node (Diamond)
            nodes.push({
                id: decisionId,
                type: 'decision',
                label: `${truncate(condition, 24)}?`,
                lineStart: lineNum,
                lineEnd: lineNum,
                description: `Loop condition check: ${condition}`,
            });
            // Loop body preview node (Rectangle)
            nodes.push({
                id: processId,
                type: 'process',
                label: `Loop Body (${language === 'python' ? 'indented' : '{...}'})`,
                lineStart: lineNum,
                lineEnd: Math.min(lineNum + 3, lines.length),
                description: `Executes while ${condition} is true`,
            });
            // Branch YES (into loop body)
            edges.push({
                id: `e_${decisionId}_${processId}`,
                source: decisionId,
                target: processId,
                label: 'YES',
                animated: true,
            });
            // Back-edge from loop body back to loop decision!
            edges.push({
                id: `e_${processId}_${decisionId}`,
                source: processId,
                target: decisionId,
                label: 'REPEAT',
            });
            // The loop decision exits on NO
            previousNodeId = decisionId;
            i++;
            continue;
        }
        // Check for Decisions (if, else if)
        const ifMatch = line.match(/^if\s*\((.*?)\)/) || line.match(/^if\s+(.*?):/);
        if (ifMatch) {
            const condition = ifMatch[1];
            const decisionId = nextId('decision');
            const thenId = nextId('then');
            const elseId = nextId('else');
            const mergeId = nextId('merge');
            edges.push({
                id: `e_${previousNodeId}_${decisionId}`,
                source: previousNodeId,
                target: decisionId,
            });
            // Decision Node (Diamond)
            nodes.push({
                id: decisionId,
                type: 'decision',
                label: `${truncate(condition, 22)}?`,
                lineStart: lineNum,
                lineEnd: lineNum,
                description: `Branch condition: ${condition}`,
            });
            // Then branch
            nodes.push({
                id: thenId,
                type: 'process',
                label: 'True Branch',
                lineStart: lineNum + 1,
                lineEnd: lineNum + 2,
                description: 'Code executed when condition is true',
            });
            // Else branch
            nodes.push({
                id: elseId,
                type: 'process',
                label: 'False Branch',
                lineStart: lineNum + 1,
                lineEnd: lineNum + 2,
                description: 'Code executed when condition is false',
            });
            edges.push({
                id: `e_${decisionId}_${thenId}`,
                source: decisionId,
                target: thenId,
                label: 'YES',
            });
            edges.push({
                id: `e_${decisionId}_${elseId}`,
                source: decisionId,
                target: elseId,
                label: 'NO',
            });
            // Join/Merge node
            nodes.push({
                id: mergeId,
                type: 'process',
                label: 'Continue Flow',
                lineStart: lineNum + 2,
                lineEnd: lineNum + 3,
            });
            edges.push({
                id: `e_${thenId}_${mergeId}`,
                source: thenId,
                target: mergeId,
            });
            edges.push({
                id: `e_${elseId}_${mergeId}`,
                source: elseId,
                target: mergeId,
            });
            previousNodeId = mergeId;
            i++;
            continue;
        }
        // Check for Input/Output (Parallelogram)
        const isInput = line.includes('cin >>') || line.includes('scanf') || line.includes('input(') || line.includes('stdin');
        const isOutput = line.includes('cout <<') || line.includes('printf') || line.includes('print(');
        if (isInput || isOutput) {
            const ioId = nextId('io');
            const cleanLabel = isInput
                ? `Input: ${truncate(line.replace(/cin\s*>>|input\(|\)|;/g, '').trim(), 20)}`
                : `Output: ${truncate(line.replace(/cout\s*<<|print\(|\)|endl|;/g, '').trim(), 20)}`;
            nodes.push({
                id: ioId,
                type: 'inputOutput',
                label: cleanLabel,
                lineStart: lineNum,
                lineEnd: lineNum,
                description: isInput ? `Reads user input (${line})` : `Prints program output (${line})`,
            });
            edges.push({
                id: `e_${previousNodeId}_${ioId}`,
                source: previousNodeId,
                target: ioId,
            });
            previousNodeId = ioId;
            i++;
            continue;
        }
        // Check for return statement
        if (line.startsWith('return ') || line === 'return;') {
            const returnId = nextId('return');
            nodes.push({
                id: returnId,
                type: 'process',
                label: truncate(line.replace(';', ''), 24),
                lineStart: lineNum,
                lineEnd: lineNum,
                description: `Returns control: ${line}`,
            });
            edges.push({
                id: `e_${previousNodeId}_${returnId}`,
                source: previousNodeId,
                target: returnId,
            });
            previousNodeId = returnId;
            i++;
            continue;
        }
        // General assignments & statements (Processes)
        if (line.includes('=') || line.includes('++') || line.includes('--') || line.endsWith(';')) {
            // Group multiple simple assignments or process one
            const procId = nextId('proc');
            nodes.push({
                id: procId,
                type: 'process',
                label: truncate(line.replace(';', ''), 24),
                lineStart: lineNum,
                lineEnd: lineNum,
                description: `Assignment/Process: ${line}`,
            });
            edges.push({
                id: `e_${previousNodeId}_${procId}`,
                source: previousNodeId,
                target: procId,
            });
            previousNodeId = procId;
            i++;
            continue;
        }
        i++;
    }
    // End Node (Terminator)
    const endId = nextId('end');
    nodes.push({
        id: endId,
        type: 'end',
        label: 'END',
        lineStart: lines.length,
        lineEnd: lines.length,
        description: 'Program Termination',
    });
    edges.push({
        id: `e_${previousNodeId}_${endId}`,
        source: previousNodeId,
        target: endId,
    });
    return { nodes, edges };
}
function truncate(text, maxLen) {
    if (!text)
        return '';
    const clean = text.replace(/[\r\n\t]+/g, ' ').trim();
    if (clean.length <= maxLen)
        return clean;
    return clean.slice(0, maxLen - 1) + '…';
}
