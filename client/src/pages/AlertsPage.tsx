
import { useCallback, useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import AlertRuleForm from "../components/alerts/AlertRuleForm";
import AlertRuleList from "../components/alerts/AlertRuleList";
import AlertHistoryList from "../components/alerts/AlertHistoryList";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { socket } from "../lib/socket";
import type { AlertRule, AlertTrigger } from "../types/alert";

export default function AlertsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [rules, setRules] = useState<AlertRule[]>([]);
  const [triggers, setTriggers] = useState<AlertTrigger[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadAlerts = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const [rulesResponse, historyResponse] = await Promise.all([
        api.get("/v1/alerts"),
        api.get("/v1/alerts/history"),
      ]);

      setRules(
        (rulesResponse.data.rules ?? []).map((rule: any) => ({
          id: String(rule.id),
          name: rule.name,
          service: rule.service ?? null,
          level: rule.level,
          threshold: Number(rule.threshold),
          windowSeconds: Number(
            rule.windowSeconds ?? rule.window_seconds
          ),
          isActive: Boolean(rule.isActive ?? rule.is_active),
        }))
      );

      setTriggers(
        (historyResponse.data.triggers ?? []).map((trigger: any) => ({
          id: String(trigger.id),
          ruleId: String(trigger.ruleId ?? trigger.rule_id),
          ruleName: trigger.ruleName ?? trigger.rule_name,
          triggeredAt: trigger.triggeredAt ?? trigger.triggered_at,
          count: Number(trigger.count),
        }))
      );
    } catch (err) {
      console.error("Failed to load alerts:", err);
      setError("Could not load alert rules or trigger history.");
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadAlerts();

    const handleNewAlert = () => {
      console.log("New alert received through Socket.IO");
      void loadAlerts(false);
    };

    // Ensure the socket is connected before listening for alerts.
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("new-alert", handleNewAlert);

    return () => {
      socket.off("new-alert", handleNewAlert);
    };
  }, [loadAlerts]);

  async function handleCreate(
    newRule: Omit<AlertRule, "id" | "isActive">
  ) {
    if (!isAdmin) return;

    try {
      setSaving(true);
      setError("");

      await api.post("/v1/alerts", newRule);

      setShowForm(false);
      await loadAlerts();
    } catch (err) {
      console.error("Failed to create alert rule:", err);
      setError(
        "Could not create the rule. Check your admin permissions and backend connection."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string) {
    if (!isAdmin) return;

    const rule = rules.find((item) => item.id === id);
    if (!rule) return;

    try {
      setError("");

      await api.patch(`/v1/alerts/${id}`, {
        isActive: !rule.isActive,
      });

      await loadAlerts();
    } catch (err) {
      console.error("Failed to update alert rule:", err);
      setError("Could not update the rule. Check your admin permissions.");
    }
  }

  async function handleDelete(id: string) {
    if (!isAdmin) return;

    try {
      setError("");

      await api.delete(`/v1/alerts/${id}`);
      await loadAlerts();
    } catch (err) {
      console.error("Failed to delete alert rule:", err);
      setError("Could not delete the rule. Check your admin permissions.");
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Alerts</h1>
          <p className="mt-1 text-sm text-slate-500">
            Rules that watch for error spikes.
          </p>
        </div>

        {isAdmin && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Create rule
          </button>
        )}
      </div>

      {!isAdmin && (
        <p className="mt-4 rounded-lg border border-slate-800 bg-slate-900/50 px-3.5 py-3 text-sm text-slate-400">
          You have read-only access to alerts. Only administrators can create,
          update, or delete alert rules.
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-300">
          {error}{" "}
          <button
            onClick={() => void loadAlerts()}
            className="underline hover:text-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {isAdmin && showForm && (
        <div className="mt-6">
          <AlertRuleForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
          {saving && (
            <p className="mt-2 text-sm text-slate-400">
              Saving rule...
            </p>
          )}
        </div>
      )}

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-slate-300">Rules</p>

        {loading ? (
          <p className="text-sm text-slate-400">Loading alert rules...</p>
        ) : (
          <AlertRuleList
            rules={rules}
            onToggle={isAdmin ? handleToggle : () => {}}
            onDelete={isAdmin ? handleDelete : () => {}}
            readOnly={!isAdmin}
          />
        )}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-slate-300">
          Recent triggers
        </p>

        {loading ? (
          <p className="text-sm text-slate-400">
            Loading trigger history...
          </p>
        ) : (
          <AlertHistoryList triggers={triggers} />
        )}
      </div>
    </Layout>
  );
}
