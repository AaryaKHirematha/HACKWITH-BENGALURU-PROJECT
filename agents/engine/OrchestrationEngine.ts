/**
 * Orchestration Engine
 * Core runtime for multi-agent coordination, task dispatch,
 * inter-agent communication, and shared memory access.
 */

import type { ThreatEvent } from '@/simulation/types';
import type {
  AgentInsight,
  AgentMessage,
  AgentRuntime,
  AgentRole,
  AgentTask,
  Investigation,
  InvestigationPhase,
  MemoryEntry,
  MessagePayload,
  MessageType,
  TaskPriority,
  TaskRequest,
  TaskResult,
  TimelineEntry,
  InsightType,
} from '../types';
import { agentProfiles } from '../definitions';

const uid = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

// ============================================================
// ORCHESTRATION ENGINE
// ============================================================

export class OrchestrationEngine {
  private runtimes: Map<string, AgentRuntime> = new Map();
  private taskQueue: AgentTask[] = [];
  private completedTasks: AgentTask[] = [];
  private messages: AgentMessage[] = [];
  private memories: MemoryEntry[] = [];
  private timeline: TimelineEntry[] = [];
  private investigations: Investigation[] = [];

  constructor() {
    this.initRuntimes();
  }

  private initRuntimes(): void {
    for (const profile of agentProfiles) {
      this.runtimes.set(profile.id, {
        agentId: profile.id,
        state: 'idle',
        currentTaskId: null,
        tasksCompleted: 0,
        tasksFailed: 0,
        averageLatencyMs: profile.averageLatencyMs,
        messagesSent: 0,
        messagesReceived: 0,
        insightsGenerated: 0,
        memoryContributions: 0,
        uptimeStarted: new Date(),
        lastActivity: new Date(),
      });
    }
  }

  getRuntimes(): AgentRuntime[] {
    return Array.from(this.runtimes.values());
  }

  getTaskQueue(): AgentTask[] {
    return [...this.taskQueue];
  }

  getCompletedTasks(): AgentTask[] {
    return [...this.completedTasks];
  }

  getMessages(): AgentMessage[] {
    return [...this.messages];
  }

  getMemories(): MemoryEntry[] {
    return [...this.memories];
  }

  getTimeline(): TimelineEntry[] {
    return [...this.timeline].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getInvestigations(): Investigation[] {
    return [...this.investigations];
  }

  // ------------------------------------------------------------------
  // TICK — main orchestration cycle
  // ------------------------------------------------------------------

  tick(eventPool: ThreatEvent[]): {
    newTasks: AgentTask[];
    completed: AgentTask[];
    messages: AgentMessage[];
    timeline: TimelineEntry[];
  } {
    const newTasks: AgentTask[] = [];
    const completed: AgentTask[] = [];
    const newMessages: AgentMessage[] = [];
    const newTimeline: TimelineEntry[] = [];

    // 1. Ingest new events → create detection tasks
    const eventsToProcess = eventPool.slice(0, 2);
    for (const event of eventsToProcess) {
      const detectionTask = this.createDetectionTask(event);
      this.taskQueue.push(detectionTask);
      newTasks.push(detectionTask);
    }

    // 2. Assign queued tasks to available agents
    this.processQueue(newMessages, newTimeline);

    // 3. Advance running tasks (simulate execution)
    this.advanceRunningTasks(completed, newMessages, newTimeline);

    // 4. Process completed task results (cascade tasks)
    this.processCompletedResults(completed, newTasks, newMessages, newTimeline);

    // 5. Advance investigation phases
    this.advanceInvestigations();

    // 6. Generate inter-agent communication
    this.generateCommunications(newMessages, newTimeline);

    this.messages.push(...newMessages);
    this.timeline.push(...newTimeline);

    return { newTasks, completed, messages: newMessages, timeline: newTimeline };
  }

  // ------------------------------------------------------------------
  // TASK CREATION
  // ------------------------------------------------------------------

  private createDetectionTask(event: ThreatEvent): AgentTask {
    return {
      id: uid('task'),
      type: 'signal_classification',
      priority: this.eventPriority(event),
      status: 'queued',
      assignedAgentId: null,
      createdByAgentId: 'system',
      payload: {
        event,
        context: {
          sourceType: event.sourceType,
          category: event.category,
          tags: event.tags,
        },
        reason: 'New inbound signal requires threat detection triage.',
        requiredCapabilities: ['signal_classification', 'severity_assessment'],
        inputTokens: 800 + event.evidence.length * 200,
      },
      result: null,
      createdAt: new Date(),
      startedAt: null,
      completedAt: null,
      timeoutMs: 5000,
      retryCount: 0,
      maxRetries: 2,
      relatedEventIds: [event.id],
    };
  }

  private createTaskFromRequest(request: TaskRequest, createdBy: string): AgentTask {
    return {
      id: uid('task'),
      type: request.type,
      priority: request.priority,
      status: 'queued',
      assignedAgentId: null,
      createdByAgentId: createdBy,
      payload: request.payload,
      result: null,
      createdAt: new Date(),
      startedAt: null,
      completedAt: null,
      timeoutMs: 8000,
      retryCount: 0,
      maxRetries: 2,
      relatedEventIds: request.payload.event ? [request.payload.event.id] : [],
    };
  }

  // ------------------------------------------------------------------
  // QUEUE PROCESSING
  // ------------------------------------------------------------------

  private processQueue(
    newMessages: AgentMessage[],
    newTimeline: TimelineEntry[],
  ): void {
    const priorityOrder: Record<TaskPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    this.taskQueue.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    for (const task of this.taskQueue) {
      if (task.status !== 'queued') continue;

      const targetAgent = this.findAvailableAgent(task);
      if (!targetAgent) continue;

      task.status = 'assigned';
      task.assignedAgentId = targetAgent.id;

      const runtime = this.runtimes.get(targetAgent.id);
      if (runtime) {
        runtime.state = 'executing';
        runtime.currentTaskId = task.id;
        runtime.lastActivity = new Date();
      }

      task.status = 'running';
      task.startedAt = new Date();

      this.pushTimeline(newTimeline, targetAgent.id, 'task_start',
        `Started ${task.type} (priority: ${task.priority})`);
      this.pushMessage(newMessages, 'system', targetAgent.id, 'task_request', { task });
    }
  }

  private findAvailableAgent(task: AgentTask): typeof agentProfiles[0] | null {
    const candidates = agentProfiles.filter((profile) => {
      const runtime = this.runtimes.get(profile.id);
      if (!runtime || runtime.state !== 'idle') return false;
      return task.payload.requiredCapabilities.some((c) =>
        profile.capabilities.includes(c),
      );
    });

    if (candidates.length > 0) return pick(candidates);

    const idle = agentProfiles.filter((p) => {
      const r = this.runtimes.get(p.id);
      return r && r.state === 'idle';
    });

    return idle.length > 0 ? pick(idle) : null;
  }

  // ------------------------------------------------------------------
  // TASK EXECUTION SIMULATION
  // ------------------------------------------------------------------

  private advanceRunningTasks(
    completed: AgentTask[],
    newMessages: AgentMessage[],
    newTimeline: TimelineEntry[],
  ): void {
    for (const task of this.taskQueue) {
      if (task.status !== 'running') continue;

      const runtime = this.runtimes.get(task.assignedAgentId!);
      if (!runtime) continue;

      const elapsed = Date.now() - (task.startedAt?.getTime() ?? Date.now());
      const agentProfile = agentProfiles.find((a) => a.id === task.assignedAgentId);
      const threshold = agentProfile ? agentProfile.averageLatencyMs + 200 : 500;

      if (elapsed >= threshold || Math.random() < 0.25) {
        const success = Math.random() > 0.04;
        task.status = success ? 'completed' : 'failed';
        task.completedAt = new Date();
        runtime.tasksCompleted += success ? 1 : 0;
        runtime.tasksFailed += success ? 0 : 1;
        runtime.state = 'idle';
        runtime.currentTaskId = null;
        runtime.lastActivity = new Date();

        const result = this.generateTaskResult(task, success);
        task.result = result;

        completed.push(task);
        this.completedTasks.push(task);

        this.pushTimeline(newTimeline, task.assignedAgentId!, 'task_complete',
          `${success ? 'Completed' : 'Failed'} ${task.type}`);
        this.pushMessage(newMessages, task.assignedAgentId!, 'system', 'task_result', { result });

        if (success && result.insights.length > 0) {
          this.createMemoryFromTask(task, result);
        }
      }
    }

    this.taskQueue = this.taskQueue.filter(
      (t) => t.status === 'queued' || t.status === 'assigned' || t.status === 'running',
    );
  }

  private generateTaskResult(task: AgentTask, success: boolean): TaskResult {
    const agent = agentProfiles.find((a) => a.id === task.assignedAgentId);
    const agentRole = (agent?.role ?? 'threat_detection') as AgentRole;

    if (!success) {
      return {
        success: false,
        output: `Task ${task.type} failed — retrying or escalating.`,
        insights: [],
        generatedTasks: [],
        tokensUsed: task.payload.inputTokens,
        confidence: 0,
        reasoningChain: ['Received task', 'Processing initiated', 'Execution failed — insufficient confidence.'],
      };
    }

    const reasoningChain = this.generateReasoningChain(agentRole);
    const insights = this.generateInsights(task, agentRole);
    const cascadedTasks = this.generateCascadedTasks(task, agentRole);

    return {
      success: true,
      output: this.generateOutput(task.type, agentRole),
      insights,
      generatedTasks: cascadedTasks,
      tokensUsed: Math.round(task.payload.inputTokens * (0.6 + Math.random() * 0.8)),
      confidence: clamp(72 + Math.random() * 26, 50, 99),
      reasoningChain,
    };
  }

  private generateReasoningChain(role: AgentRole): string[] {
    const chains: Record<AgentRole, string[]> = {
      threat_detection: [
        'Received inbound signal for classification',
        'Comparing against baseline behavioral profiles',
        'Extracting IOCs and cross-referencing threat intelligence feeds',
        'Scoring anomaly against historical patterns',
        'Classification complete — assigning confidence and severity',
      ],
      correlation: [
        'Loading recent event graph for cross-correlation',
        'Building temporal adjacency matrix across entity relationships',
        'Identifying shared indicators across disparate events',
        'Mapping linked events to candidate attack chains',
        'Correlation graph finalized — emitting linked cluster',
      ],
      reflection: [
        'Reviewing conclusions from upstream agent analysis',
        'Challenging confidence assumptions with adversarial probes',
        'Checking for confirmation bias in reasoning chain',
        'Validating against known false-positive patterns',
        'Quality assessment complete — adjusted confidence',
      ],
      investigation: [
        'Initiating deep forensic analysis of flagged indicators',
        'Constructing event timeline from evidence chain',
        'Performing malware behavior simulation replay',
        'Cross-referencing with historical case files',
        'Investigation summary compiled — ready for narrative',
      ],
      cost_optimization: [
        'Auditing token usage across active investigation pipeline',
        'Identifying redundant inference calls for consolidation',
        'Evaluating tier-1 substitution opportunities',
        'Computing cost-per-insight efficiency metrics',
        'Optimization recommendations emitted',
      ],
      narrative_generation: [
        'Aggregating findings from investigation and correlation agents',
        'Synthesizing executive-level summary from raw analysis',
        'Drafting incident timeline with human-readable context',
        'Formatting intelligence report with actionable recommendations',
        'Narrative compiled — ready for stakeholder distribution',
      ],
    };

    return chains[role];
  }

  private generateInsights(task: AgentTask, role: AgentRole): AgentInsight[] {
    if (Math.random() < 0.35) return [];

    const insightTypesByRole: Record<AgentRole, InsightType[]> = {
      threat_detection: ['threat_detected', 'pattern_anomaly'],
      correlation: ['correlation_identified', 'attack_chain_mapped'],
      reflection: ['pattern_anomaly', 'false_positive_assessed'],
      investigation: ['ioc_enriched', 'remediation_recommended'],
      cost_optimization: ['cost_optimization_applied'],
      narrative_generation: ['false_positive_assessed'],
    };

    const insightType = pick(insightTypesByRole[role]);
    const event = task.payload.event;

    return [
      {
        id: uid('insight'),
        agentId: task.assignedAgentId ?? '',
        agentRole: role,
        type: insightType,
        title: this.generateInsightTitle(insightType),
        summary: this.generateInsightSummary(insightType, event),
        confidence: clamp(68 + Math.random() * 30, 50, 99),
        severity: event?.threatLevel ?? 'medium',
        relatedEventIds: task.relatedEventIds,
        supportingEvidence: [
          pick(['Network flow analysis', 'Endpoint telemetry', 'Log correlation', 'Behavioral baseline deviation']),
          pick(['IP reputation lookup', 'File hash analysis', 'Process tree inspection', 'DNS query pattern']),
        ],
        timestamp: new Date(),
      },
    ];
  }

  private generateCascadedTasks(task: AgentTask, role: AgentRole): TaskRequest[] {
    const requests: TaskRequest[] = [];
    const event = task.payload.event;
    if (!event) return requests;

    if (role === 'threat_detection' && event.anomalyScore > 65) {
      requests.push({
        type: 'cross_event_correlation',
        priority: event.threatLevel === 'critical' ? 'critical' : 'high',
        payload: {
          event,
          context: { fromAgent: 'sentinel', trigger: 'anomaly_above_threshold' },
          reason: 'Anomaly score exceeds detection threshold — requiring correlation analysis.',
          requiredCapabilities: ['cross_event_correlation', 'attack_chain_mapping'],
          inputTokens: 1200,
        },
        suggestedAgentRole: 'correlation',
      });
    }

    if (role === 'correlation' && event.relatedEvents.length > 2) {
      requests.push({
        type: 'forensic_analysis',
        priority: 'high',
        payload: {
          event,
          context: { fromAgent: 'nexus', linkedEvents: event.relatedEvents.length },
          reason: 'Multi-event cluster detected — deep investigation warranted.',
          requiredCapabilities: ['forensic_analysis', 'timeline_construction'],
          inputTokens: 2000,
        },
        suggestedAgentRole: 'investigation',
      });
      requests.push({
        type: 'hypothesis_challenge',
        priority: 'medium',
        payload: {
          event,
          context: { fromAgent: 'nexus', clusterSize: event.relatedEvents.length },
          reason: 'Correlated cluster requires reflection review before escalation.',
          requiredCapabilities: ['hypothesis_challenge', 'confidence_calibration'],
          inputTokens: 1500,
        },
        suggestedAgentRole: 'reflection',
      });
    }

    if (role === 'investigation' && Math.random() > 0.5) {
      requests.push({
        type: 'report_generation',
        priority: 'medium',
        payload: {
          event,
          context: { fromAgent: 'tracker', investigationComplete: true },
          reason: 'Investigation findings ready for narrative synthesis.',
          requiredCapabilities: ['report_generation', 'executive_summary'],
          inputTokens: 1800,
        },
        suggestedAgentRole: 'narrative_generation',
      });
    }

    if (role === 'reflection' && event.anomalyScore > 80) {
      requests.push({
        type: 'cost_optimization_audit',
        priority: 'low',
        payload: {
          event,
          context: { fromAgent: 'arbiter', highValueInvestigation: true },
          reason: 'High-value investigation requires cost-efficiency audit.',
          requiredCapabilities: ['cost_monitoring', 'budget_allocation'],
          inputTokens: 600,
        },
        suggestedAgentRole: 'cost_optimization',
      });
    }

    return requests;
  }

  // ------------------------------------------------------------------
  // INVESTIGATION MANAGEMENT
  // ------------------------------------------------------------------

  private processCompletedResults(
    completed: AgentTask[],
    newTasks: AgentTask[],
    _newMessages: AgentMessage[],
    newTimeline: TimelineEntry[],
  ): void {
    for (const task of completed) {
      if (!task.result?.success || task.result.generatedTasks.length === 0) continue;

      for (const request of task.result.generatedTasks) {
        const newTask = this.createTaskFromRequest(request, task.assignedAgentId!);
        this.taskQueue.push(newTask);
        newTasks.push(newTask);
      }
    }

    for (const task of completed) {
      const event = task.payload.event;
      if (!event || event.threatLevel !== 'critical') continue;
      if (this.investigations.some((i) => i.eventIds.includes(event.id))) continue;

      const investigation: Investigation = {
        id: uid('inv'),
        name: `Investigation: ${event.title.slice(0, 60)}`,
        eventIds: [event.id],
        involvedAgents: ['threat_detection', 'correlation', 'investigation'],
        phase: 'detection',
        progress: 15,
        startedAt: new Date(),
        lastUpdated: new Date(),
        keyFindings: [event.aiSummary],
        status: 'active',
      };
      this.investigations.push(investigation);

      this.pushTimeline(newTimeline, 'system', 'task_start',
        `New investigation launched: ${investigation.name}`);
    }
  }

  private advanceInvestigations(): void {
    const phases: InvestigationPhase[] = [
      'detection', 'collection', 'correlation', 'analysis', 'reflection', 'narrative', 'conclusion',
    ];

    for (const inv of this.investigations) {
      if (inv.status !== 'active') continue;
      if (Math.random() < 0.3) continue;

      const idx = phases.indexOf(inv.phase);
      if (idx < phases.length - 1) {
        inv.phase = phases[idx + 1];
        inv.progress = clamp(inv.progress + 12 + Math.random() * 10, 0, 100);
        inv.lastUpdated = new Date();
      } else {
        inv.status = Math.random() > 0.2 ? 'completed' : 'escalated';
        inv.progress = 100;
      }
    }
  }

  // ------------------------------------------------------------------
  // COMMUNICATIONS
  // ------------------------------------------------------------------

  private generateCommunications(newMessages: AgentMessage[], newTimeline: TimelineEntry[]): void {
    if (Math.random() < 0.4) return;

    const activeAgents = agentProfiles.filter((p) => {
      const r = this.runtimes.get(p.id);
      return r && (r.state === 'reasoning' || r.state === 'executing' || r.state === 'idle');
    });

    if (activeAgents.length < 2) return;

    const from = pick(activeAgents);
    let to = pick(activeAgents);
    while (to.id === from.id && activeAgents.length > 1) {
      to = pick(activeAgents);
    }

    const msgTypes: MessageType[] = ['insight_broadcast', 'reasoning_share', 'status_update'];
    const msgType = pick(msgTypes);

    this.pushMessage(newMessages, from.id, to.id, msgType, {
      insight: this.buildRandomInsight(from.id, from.role),
      reasoningChain: this.generateReasoningChain(from.role).slice(0, 2),
    });

    this.pushTimeline(newTimeline, from.id, 'message_sent',
      `Communicated ${msgType.replace(/_/g, ' ')} → ${to.codename}`);
  }

  // ------------------------------------------------------------------
  // SHARED MEMORY
  // ------------------------------------------------------------------

  private createMemoryFromTask(task: AgentTask, result: TaskResult): void {
    const agent = agentProfiles.find((a) => a.id === task.assignedAgentId);
    if (!agent) return;

    const memTypes: MemoryEntry['type'][] = [
      'pattern_observation', 'correlation_finding', 'anomaly_insight',
      'threat_actor_profile', 'ioc_fingerprint', 'behavioral_baseline',
    ];

    const memory: MemoryEntry = {
      id: uid('mem'),
      agentId: agent.id,
      agentRole: agent.role,
      type: pick(memTypes),
      content: result.output,
      context: {
        taskType: task.type,
        confidence: result.confidence,
        eventTags: task.payload.event?.tags ?? [],
      },
      confidence: result.confidence,
      importance: task.priority === 'critical' ? 0.9 : task.priority === 'high' ? 0.7 : 0.5,
      decayType: 'exponential',
      decayFactor: 0.02,
      accessCount: 0,
      lastAccessed: new Date(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000 * 7),
      relatedMemoryIds: [],
      tags: task.payload.event?.tags ?? [],
    };

    this.memories.push(memory);

    const runtime = this.runtimes.get(agent.id);
    if (runtime) {
      runtime.memoryContributions += 1;
    }
  }

  // ------------------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------------------

  private eventPriority(event: ThreatEvent): TaskPriority {
    const map: Record<string, TaskPriority> = {
      critical: 'critical', high: 'high', medium: 'medium', low: 'low', info: 'low',
    };
    return map[event.threatLevel] ?? 'medium';
  }

  private pushTimeline(
    arr: TimelineEntry[],
    agentId: string,
    eventType: TimelineEntry['eventType'],
    description: string,
  ): void {
    const agent = agentProfiles.find((a) => a.id === agentId);
    arr.push({
      id: uid('tl'),
      timestamp: new Date(),
      agentId,
      agentRole: agent?.role ?? 'threat_detection',
      eventType,
      description,
    });
  }

  private pushMessage(
    arr: AgentMessage[],
    from: string,
    to: string,
    type: MessageType,
    payload: MessagePayload,
  ): void {
    arr.push({
      id: uid('msg'),
      type,
      fromAgentId: from,
      toAgentId: to,
      payload,
      timestamp: new Date(),
      delivered: true,
      acknowledged: Math.random() > 0.3,
    });
  }

  private generateInsightTitle(type: InsightType): string {
    const titles: Record<InsightType, string> = {
      threat_detected: 'Threat signal classified with high confidence',
      correlation_identified: 'Multi-event correlation cluster identified',
      pattern_anomaly: 'Behavioral pattern deviation detected',
      false_positive_assessed: 'Candidate false-positive flagged for review',
      attack_chain_mapped: 'Partial attack chain mapped from linked events',
      ioc_enriched: 'New IOC fingerprint added to intelligence store',
      remediation_recommended: 'Containment action recommended',
      cost_optimization_applied: 'Inference cost pathway optimized',
      behavioral_deviation: 'Behavioral baseline deviation observed',
    };
    return titles[type];
  }

  private generateInsightSummary(type: InsightType, event?: ThreatEvent): string {
    if (!event) return 'Analysis complete.';

    const summaries: Record<string, string> = {
      threat_detected: `Event "${event.title}" classified as ${event.threatLevel} severity with ${event.anomalyScore}% anomaly score.`,
      correlation_identified: `${event.relatedEvents.length} linked events form a coherent cluster suggesting coordinated activity.`,
      pattern_anomaly: `Behavioral baseline deviation exceeds threshold for source type "${event.sourceType}".`,
      false_positive_assessed: `Confidence assessment suggests ${(100 - event.confidenceScore).toFixed(0)}% false-positive risk.`,
      attack_chain_mapped: `Event maps to kill chain phase "${event.killChainPhase ?? 'unknown'}" with ${(event.confidenceScore * 0.9).toFixed(0)}% confidence.`,
      ioc_enriched: `Extracted ${(event.evidence.length * 2).toFixed(0)} candidate indicators for enrichment.`,
      remediation_recommended: `Recommend isolation of affected entity pending full investigation.`,
      cost_optimization_applied: `Route optimization saved estimated $${(0.003 + Math.random() * 0.01).toFixed(4)} on this inference path.`,
      behavioral_deviation: `Observed behavioral deviation for entity in category "${event.category}".`,
    };
    return summaries[type] ?? 'Analysis completed successfully.';
  }

  private generateOutput(taskType: string, role: AgentRole): string {
    const outputs: Record<string, string> = {
      signal_classification: 'Signal classified. Severity and confidence scores assigned. Ready for downstream correlation.',
      cross_event_correlation: 'Correlation analysis complete. Linked event cluster identified and mapped.',
      forensic_analysis: 'Forensic examination concluded. Evidence chain constructed and timeline validated.',
      hypothesis_challenge: 'Adversarial review complete. Confidence adjusted based on assumption audit.',
      report_generation: 'Intelligence narrative compiled. Ready for executive distribution.',
      cost_optimization_audit: 'Cost audit complete. Identified token compression and tier-down opportunities.',
    };
    return outputs[taskType] ?? `${role} task completed successfully.`;
  }

  private buildRandomInsight(agentId: string, role: AgentRole): AgentInsight {
    return {
      id: uid('insight'),
      agentId,
      agentRole: role,
      type: pick(['pattern_anomaly', 'threat_detected', 'correlation_identified', 'ioc_enriched'] as InsightType[]),
      title: 'Collaborative observation shared',
      summary: pick([
        'Recurring pattern noted in credential access timestamps.',
        'Elevated entropy observed in outbound DNS query sequences.',
        'New baseline established for badge access patterns on floor 3.',
        'Campaign fingerprint matches historical APT-29 behavior.',
      ]),
      confidence: 70 + Math.random() * 28,
      severity: pick(['info', 'low', 'medium', 'high'] as const),
      relatedEventIds: [],
      supportingEvidence: [pick(['Correlator observation', 'Behavioral trace', 'Historical pattern match'])],
      timestamp: new Date(),
    };
  }
}
