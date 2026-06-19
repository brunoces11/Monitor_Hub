#!/usr/bin/env bash
set -euo pipefail

OUTPUT_PATH="${OUTPUT_PATH:-/compose/volume/hub_monitor/sync/vps_monitor.json}"
TMP_PATH="${OUTPUT_PATH}.tmp"
MONITOR_INTERVAL_MS="${MONITOR_INTERVAL_MS:-15000}"

mkdir -p "$(dirname "$OUTPUT_PATH")"

json_escape() {
  local value="${1-}"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  value="${value//$'\n'/\\n}"
  value="${value//$'\r'/\\r}"
  value="${value//$'\t'/\\t}"
  printf '%s' "$value"
}

human_uptime() {
  local started_at="$1"
  local started_epoch now_epoch diff_days
  started_epoch="$(date -u -d "$started_at" +%s 2>/dev/null || echo 0)"
  now_epoch="$(date -u +%s)"
  if [[ "$started_epoch" -le 0 ]]; then
    printf '%s' '-'
    return
  fi

  diff_days=$(( (now_epoch - started_epoch) / 86400 ))
  if [[ "$diff_days" -lt 1 ]]; then
    printf '%s' '0 days'
  elif [[ "$diff_days" -eq 1 ]]; then
    printf '%s' '1 day'
  else
    printf '%s days' "$diff_days"
  fi
}

format_total_cpu() {
  local cpu="$1"
  cpu="${cpu%%%}"
  printf '%s%%' "${cpu%%.*}"
}

format_total_mem() {
  local mem="$1"
  mem="${mem%%%}"
  printf '%s%%' "${mem%%.*}"
}

read_containers() {
  docker ps --no-trunc --format '{{.ID}}\t{{.Names}}\t{{.State}}\t{{.RunningFor}}\t{{.Status}}'
}

{
  printf '{\n'
  printf '  "schema_version": 1,\n'
  printf '  "title": "VPS Monitor",\n'
  printf '  "updated_at": "%s",\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf '  "refresh_interval_ms": %s,\n' "$MONITOR_INTERVAL_MS"
  printf '  "columns": [\n'
  printf '    {"key":"service_name","label":"SERVICE NAME"},\n'
  printf '    {"key":"state","label":"STATE"},\n'
  printf '    {"key":"cpu","label":"CPU"},\n'
  printf '    {"key":"mem","label":"MEM"},\n'
  printf '    {"key":"mem_percent","label":"MEM%%"},\n'
  printf '    {"key":"uptime","label":"UPTIME"}\n'
  printf '  ],\n'
  printf '  "services": [\n'

  first=1
  total_cpu_sum=0
  total_mem_sum=0
  total_count=0

  while IFS=$'\t' read -r container_id container_name container_state running_for container_status; do
    [[ -n "${container_id:-}" ]] || continue

    stats_line="$(docker stats --no-stream --format '{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}' "$container_id" 2>/dev/null || true)"
    cpu_perc="${stats_line%%$'\t'*}"
    rest="${stats_line#*$'\t'}"
    mem_usage="${rest%%$'\t'*}"
    mem_perc="${stats_line##*$'\t'}"

    if [[ "$stats_line" == "$cpu_perc" ]]; then
      cpu_perc="0.00%"
      mem_usage="0B / 0B"
      mem_perc="0.00%"
    fi

    mem_current="${mem_usage%% /*}"
    uptime_value="$(docker inspect --format '{{.State.StartedAt}}' "$container_id" 2>/dev/null || true)"
    uptime_text="$(human_uptime "$uptime_value")"

    cpu_numeric="${cpu_perc%%%}"
    cpu_numeric="${cpu_numeric//,/.}"
    mem_percent_numeric="${mem_perc%%%}"
    mem_percent_numeric="${mem_percent_numeric//,/.}"
    total_cpu_sum="$(awk "BEGIN { print (${total_cpu_sum:-0} + ${cpu_numeric:-0}) }")"
    total_mem_sum="$(awk "BEGIN { print (${total_mem_sum:-0} + ${mem_percent_numeric:-0}) }")"
    total_count=$((total_count + 1))

    [[ "$first" -eq 1 ]] || printf ',\n'
    first=0

    printf '    {\n'
    printf '      "service_name": "%s",\n' "$(json_escape "$container_name")"
    printf '      "state": "%s",\n' "$(json_escape "$container_state")"
    printf '      "cpu": "%s",\n' "$(json_escape "$cpu_perc")"
    printf '      "mem": "%s",\n' "$(json_escape "$mem_current")"
    printf '      "mem_percent": "%s",\n' "$(json_escape "$mem_perc")"
    printf '      "uptime": "%s"\n' "$(json_escape "$uptime_text")"
    printf '    }'
  done < <(read_containers)

  printf '\n  ],\n'
  printf '  "totals": {\n'
  printf '    "service_name": "",\n'
  printf '    "state": "Total CPU",\n'
  printf '    "cpu": "%s",\n' "$(format_total_cpu "${total_cpu_sum:-0}")"
  printf '    "mem": "Total Mem",\n'
  printf '    "mem_percent": "%s",\n' "$(format_total_mem "${total_mem_sum:-0}")"
  printf '    "uptime": "-"\n'
  printf '  }\n'
  printf '}\n'
} > "$TMP_PATH"

mv "$TMP_PATH" "$OUTPUT_PATH"
