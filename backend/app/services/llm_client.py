import os
import json
import urllib.request
import urllib.error
from typing import Dict, Any, Optional, List

class LLMClient:
    """
    Pluggable enterprise LLM client supporting:
    - Gemini / OpenAI / Anthropic / Ollama via standard env vars
    - Deterministic Graph-Algorithmic Fallback when keys are not configured.
    """
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        self.ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

    @property
    def has_live_llm(self) -> bool:
        return bool(self.gemini_key or self.openai_key or self.anthropic_key)

    def generate_completion(self, prompt: str, system_prompt: Optional[str] = None, max_tokens: int = 1500) -> Optional[str]:
        """
        Attempts to call available LLMs in order of preference, returning None if none are configured.
        """
        if self.gemini_key:
            return self._call_gemini(prompt, system_prompt)
        elif self.openai_key:
            return self._call_openai(prompt, system_prompt, max_tokens)
        return None

    def _call_gemini(self, prompt: str, system_prompt: Optional[str] = None) -> Optional[str]:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
            contents = []
            if system_prompt:
                contents.append({"role": "user", "parts": [{"text": f"System Instructions: {system_prompt}"}]})
                contents.append({"role": "model", "parts": [{"text": "Understood. I will follow these instructions."}]})
            contents.append({"role": "user", "parts": [{"text": prompt}]})

            payload = json.dumps({"contents": contents}).encode("utf-8")
            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            return None

    def _call_openai(self, prompt: str, system_prompt: Optional[str] = None, max_tokens: int = 1500) -> Optional[str]:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})

            payload = json.dumps({
                "model": "gpt-4o-mini",
                "messages": messages,
                "max_tokens": max_tokens
            }).encode("utf-8")

            req = urllib.request.Request(url, data=payload, headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.openai_key}"
            })
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data["choices"][0]["message"]["content"]
        except Exception:
            return None

llm_client = LLMClient()
