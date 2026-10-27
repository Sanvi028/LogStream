import * as alertRuleModel from "../models/alertRuleModel.js";
import * as alertTriggerModel from "../models/alertTriggerModel.js";

export async function create(req, res, next) {
  try {
    const { name, service, level, threshold, windowSeconds } = req.body;
    if (!name || !level || !threshold || !windowSeconds) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const rule = await alertRuleModel.createRule({
      name, service, level, threshold, windowSeconds,
      createdBy: req.user.id,
    });
    res.status(201).json(rule);
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const rules = await alertRuleModel.getAllRules();
    res.json({ rules });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const rule = await alertRuleModel.updateRule(req.params.id, req.body);
    if (!rule) return res.status(404).json({ message: "Rule not found." });
    res.json(rule);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await alertRuleModel.deleteRule(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function history(req, res, next) {
  try {
    const triggers = await alertTriggerModel.getRecentTriggers();
    res.json({ triggers });
  } catch (err) {
    next(err);
  }
}