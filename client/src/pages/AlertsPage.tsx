import { useState } from "react";
import Layout from "../components/layout/Layout";
import AlertRuleForm from "../components/alerts/AlertRuleForm";
import AlertRuleList from "../components/alerts/AlertRuleList";
import AlertHistoryList from "../components/alerts/AlertHistoryList";
import { mockAlertRules, mockAlertTriggers } from "../lib/mock/mockAlerts";
import type { AlertRule } from "../types/alert";

export default function AlertsPage() {
  const [rules, setRules] = useState<AlertRule[]>(mockAlertRules);
  const [showForm, setShowForm] = useState(false);

  function handleCreate(newRule: Omit<AlertRule, "id" | "isActive">) {
    setRules((prev) => [
      { ...newRule, id: `rule_${Date.now()}`, isActive: true },
      ...prev,
    ]);
    setShowForm(false);
  }

  function handleToggle(id: string) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  }

  function handleDelete(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Alerts</h1>
          <p className="mt-1 text-sm text-slate-500">Rules that watch for error spikes.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Create rule
          </button>
        )}
      </div>

      {showForm && (
        <div className="mt-6">
          <AlertRuleForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-slate-300">Rules</p>
        <AlertRuleList rules={rules} onToggle={handleToggle} onDelete={handleDelete} />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-slate-300">Recent triggers</p>
        <AlertHistoryList triggers={mockAlertTriggers} />
      </div>
    </Layout>
  );
}