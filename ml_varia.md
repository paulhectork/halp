# ML and CV in general

## I/O: Transformer Tokenization & Detokenization: Text vs. Computer Vision

### 1. Text Processing

#### **Input: Tokenization**

- Break raw text into tokens (words, subwords, or characters).
- Map each piece to a unique token ID.
- Add special tokens as needed (`[START]`, `[END]`, `[PAD]`).

**Example:**
```
Raw Text:    "I love playing with cats!"
Tokenizer:   ["I", "love", "play", "ing", "with", "cats", "!"]
Token IDs:   [23, 102, 207, 45, 82, 156, 4]
```

#### **Output: Detokenization**

- Convert model output (token IDs) back into text.
- Merge subword units, format, and remove special tokens.

### 2. Computer Vision

#### **Input: Tokenization (Patchification)**

- Divide the image into fixed-size patches (e.g., 16x16 pixels).
- Flatten and project each patch into a vector (token).
- Add positional embeddings if needed.

**Example:**
```
Original: 224x224 image
Patch Size: 16x16
→ 14x14 = 196 patches
→ Each patch = 1 token
```

#### **Output: Detokenization (Reconstruction)**

- Convert output tokens back into image patches.
- Arrange patches in original grid order to reconstruct the image.

### 3. Tokenization: Not Unique to Transformers

- Tokenization is a **general preprocessing technique** for many architectures handling sequential or structured data.

#### **In Text:**
- Used by RNNs, LSTMs, GRUs, and text-based CNNs—not just transformers.
- All require the input text to be split into tokens and mapped to numerical representations.

#### **In Images:**
- Traditional CNNs typically operate directly on the full grid of pixels, not on patches as tokens.
- Some modern non-transformer architectures (e.g., MLP-Mixer, hybrid CNN-transformers) do use patchification/tokenization.

#### **Other Modalities:**
- Audio, time series, and other sequential data also undergo decomposition into tokens or frames before processing.

#### **What’s Unique in Transformers?**
- The core transformer block (attention + feedforward layers) operates on sequences of tokens as its fundamental data structure.
- The importance of token order or position is handled explicitly (with positional embeddings), rather than implicitly as in RNNs/CNNs.

### 4. Schema

```
TEXT:    Raw Text → Tokenization → Transformer → Detokenization → Human-readable Text

VISION:  Raw Image → Patch Tokenization → Transformer → Patch Assembly → Human-viewable Image
```

