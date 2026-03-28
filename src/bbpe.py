from .bpe import CoreSubwordTokenizer

class ByteLevelEngine(CoreSubwordTokenizer):
    def train(self, text):
        # Convert entire text to UTF-8 bytes immediately
        raw_bytes = list(text.encode("utf-8"))
        num_merges = self.vocab_size - 256
        
        ids = raw_bytes
        for i in range(num_merges):
            stats = self.get_stats(ids)
            if not stats: break
            best = max(stats, key=stats.get)
            new_id = 256 + i
            ids = self.merge(ids, best, new_id)
            self.merges[best] = new_id