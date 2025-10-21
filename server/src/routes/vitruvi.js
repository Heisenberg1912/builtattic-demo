import { Router } from "express";
import { getAnalysis, runAnalyzeAndGenerate } from "../services/vitruviService.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ ok: true, service: "vitruvi-ai" });
});

router.post("/analyze", async (req, res) => {
  const { prompt = "", options = {} } = req.body || {};
  if (!prompt.trim()) {
    return res.status(400).json({ error: "prompt_required" });
  }

  try {
    const result = await getAnalysis(prompt, options);
    res.json(result);
  } catch (err) {
    console.error("vitruvi_analyze_failed", err);
    const status = typeof err.status === "number" ? err.status : 500;
    res.status(status).json({ error: "analyze_failed", detail: err.message });
  }
});

router.post("/analyze-and-generate", async (req, res) => {
  const { prompt = "", options = {} } = req.body || {};
  if (!prompt.trim()) {
    return res.status(400).json({ error: "prompt_required" });
  }

  try {
    const result = await runAnalyzeAndGenerate(prompt, options);
    res.json(result);
  } catch (err) {
    console.error("vitruvi_compose_failed", err);
    const status = typeof err.status === "number" ? err.status : 500;
    res.status(status).json({ error: "compose_failed", detail: err.message });
  }
});

router.post("/generate", async (req, res) => {
  const { prompt = "", options = {} } = req.body || {};
  if (!prompt.trim()) {
    return res.status(400).json({ error: "prompt_required" });
  }

  try {
    const result = await runAnalyzeAndGenerate(prompt, options);
    res.json(result);
  } catch (err) {
    console.error("vitruvi_generate_failed", err);
    const status = typeof err.status === "number" ? err.status : 500;
    res.status(status).json({ error: "generate_failed", detail: err.message });
  }
});

export default router;
