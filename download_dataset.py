from datasets import load_dataset
import os

# Create directory if it doesn't exist
os.makedirs('data/raw', exist_ok=True)

# Load wikitext-2 (smaller, ~4.5MB) or wikitext-103 (larger, ~500MB)
# Using 'raw' version is best for training new tokenizers from scratch
dataset = load_dataset("wikitext", "wikitext-2-raw-v1", split="train")

# Save to your project folder
with open('data/raw/wikitext_sample.txt', 'w', encoding='utf-8') as f:
    for line in dataset['text']:
        if line.strip(): # Avoid saving empty lines
            f.write(line + "\n")

print("Dataset saved to data/raw/wikitext_sample.txt")