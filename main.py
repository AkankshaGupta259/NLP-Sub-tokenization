from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os
import pandas as pd

# Ensure the src module can be found
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from src.bpe import BPETokenizer

app = FastAPI()

# Allow Next.js to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Load ALL available tokenizers
tokenizers = {}
print("Loading tokenizers...")
for size in [8000, 16000, 32000]:
    vocab_file = f'vocabs/bpe_{size}.json'
    if os.path.exists(vocab_file):
        tk = BPETokenizer()
        tk.load(vocab_file)
        tokenizers[size] = tk
        print(f"✅ Loaded {size} vocab")
    else:
        print(f"⚠️ {size} vocab missing")

class TokenizeRequest(BaseModel):
    text: str

# 2. Interactive Comparison Endpoint
@app.post("/api/tokenize")
def tokenize_text(request: TokenizeRequest):
    results = {}
    for size, tk in tokenizers.items():
        eval_data = tk.encode(request.text)
        results[size] = {
            "tokens": eval_data['tokens'],
            "oov_rate": eval_data['oov_rate'],
            "tokens_per_word": eval_data['tokens_per_word']
        }
    return results

# 3. Report Data Endpoint
@app.get("/api/reports")
def get_reports():
    def load_csv(path):
        if os.path.exists(path):
            return pd.read_csv(path).to_dict(orient="records")
        return []
        
    return {
        "performance": load_csv('reports/performance_metrics.csv'),
        "robustness": load_csv('reports/robustness_metrics.csv'),
        "fairness": load_csv('reports/fairness_audit.csv')
    }