export function toFlow(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    url: row.url,
    mode: row.mode,
    status: row.status,
    steps: row.steps,
    outputSchema: row.output_schema,
    schedule: row.schedule,
    successRate: row.success_rate,
    totalRuns: row.total_runs,
    avgDuration: row.avg_duration,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastRunAt: row.last_run_at,
  }
}

export function toRun(row: Record<string, unknown>) {
  return {
    id: row.id,
    flowId: row.flow_id,
    flowName: row.flow_name,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    duration: row.duration,
    itemsExtracted: row.items_extracted,
    error: row.error,
    outputPreview: row.output_preview,
    logs: row.logs,
    cost: row.cost,
  }
}
