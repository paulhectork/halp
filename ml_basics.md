# ML and CV in general

---

## I/O: tokenization & detokenization: Text vs. Computer Vision

### 1. Text processing

#### **Input: tokenization**

- break raw text into tokens (words, subwords, or characters).
- map each piece to a unique token ID.
- add special tokens as needed (`[START]`, `[END]`, `[PAD]`).

```
Raw Text:    "I love playing with cats!"
Tokenizer:   ["I", "love", "play", "ing", "with", "cats", "!"]
Token IDs:   [23, 102, 207, 45, 82, 156, 4]
```

#### **Output: detokenization**

- convert model output (token IDs) back into text.
- merge subword units, format, and remove special tokens.

### 2. Computer vision

#### **Input: tokenization (patchification)**

- pivide the image into fixed-size patches (e.g., 16x16 pixels).
- flatten and project each patch into a vector (token).
- add positional embeddings if needed.

```
original: 224x224 image
patch Size: 16x16
→ 14x14 = 196 patches
→ each patch = 1 token
```

#### **Output: detokenization (reconstruction)**

- convert output tokens back into image patches.
- arrange patches in original grid order to reconstruct the image.

### Summary

```
TEXT:    Raw Text → Tokenization → Transformer → Detokenization → Human-readable Text

VISION:  Raw Image → Patch Tokenization → Transformer → Patch Assembly → Human-viewable Image
```

