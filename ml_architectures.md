# ML ARCHITECTURES

--- 
---

## Transformer Architecture: Detailed Overview

```bibtex
@article{DBLP:journals/corr/VaswaniSPUJGKP17,
  author       = {Ashish Vaswani and
                  Noam Shazeer and
                  Niki Parmar and
                  Jakob Uszkoreit and
                  Llion Jones and
                  Aidan N. Gomez and
                  Lukasz Kaiser and
                  Illia Polosukhin},
  title        = {Attention Is All You Need},
  journal      = {CoRR},
  volume       = {abs/1706.03762},
  year         = {2017},
  url          = {http://arxiv.org/abs/1706.03762},
  eprinttype   = {arXiv},
  eprint       = {1706.03762},
  timestamp    = {Sat, 23 Jan 2021 01:20:40 +0100},
  biburl       = {https://dblp.org/rec/journals/corr/VaswaniSPUJGKP17.bib},
  bibsource    = {dblp computer science bibliography, https://dblp.org}
}
```

---

### Core Structure

A transformer model is built by stacking multiple identical blocks, each composed of two main steps:

1. **Multi-Head Self-Attention Layer** – the "learning" or "information gathering" phase  
2. **Feed-Forward Neural Network (FFN)** – the "decision" or "processing" phase  

These steps are wrapped with residual connections and layer normalization for stability and improved learning.

---

### Step 1: Multi-Head Self-Attention Layer ("Learning Phase")

- **Purpose:**  
  Enables each position in the input sequence to "look at" (attend to) every other position and gather relevant information, regardless of their distance in the sequence.

- **Detailed Process:**  
  1. **Linear Projections:**  
     - Each input token embedding is linearly transformed into three vectors: Query (Q), Key (K), and Value (V).
  2. **Attention Score Computation:**  
     - For each token, compute the similarity between its Query and the Keys of all tokens (including itself) using dot products, yielding a score matrix.
  3. **Scaling and Softmax:**  
     - The scores are divided by the square root of the dimension size (for stability), then passed through a softmax function to obtain normalized attention weights.
  4. **Weighted Sum:**  
     - Each token's output is computed as a weighted sum of all Value vectors, using the attention weights.
  5. **Multiple Heads:**  
     - The process is done in parallel with multiple "heads," each with its own Q, K, V projections, allowing the model to focus on different relationships or features.
  6. **Concatenation and Projection:**  
     - Outputs from all heads are concatenated and passed through a final linear projection to produce the attention output.

- **Metaphor:**  
  Like a student reading a textbook, looking back and forth over the entire content to collect every relevant fact, clue, or relationship before making a conclusion.

---

### Step 2: Feed-Forward Neural Network (FFN) ("Decision Phase")

- **Purpose:**  
  Processes the gathered information at each position independently to make local decisions or transformations.

- **Detailed Process:**  
  1. **First Linear Transformation:**  
     - The output from the attention layer at each position is passed through a fully connected (dense) layer, typically expanding the dimensionality (hidden size increases).
  2. **Non-Linearity:**  
     - A non-linear activation function (usually ReLU or GELU) is applied, introducing the capacity to model complex relationships.
  3. **Second Linear Transformation:**  
     - The activated values are passed through another dense layer, reducing the dimensionality back to the original embedding size.
  4. **Position-wise Operation:**  
     - This process occurs independently for every token position—no interaction between positions at this stage.

- **Metaphor:**  
  Like a student, after reading and gathering facts, pausing to reflect deeply on each section separately and making a decision or interpretation for that part.

---

### Residual Connections & Layer Normalization

- **Residual Connections:**  
  - The input to each sublayer (attention or FFN) is added to its output before normalization.  
  - This helps preserve the original information and allows gradients to flow more easily during training, addressing the "vanishing gradient" problem in deep models.

- **Layer Normalization (LayerNorm):**  
  - Applied **after** each residual addition.
  - Standardizes the summed output (input + sublayer output) for each token independently by:
    - Subtracting the mean and dividing by the standard deviation of the features for that token.
    - Scaling and shifting the normalized values with learned parameters (`gamma` and `beta`).
  - Unlike batch normalization (which works across a batch), layer normalization operates across the features of a single example, making it robust for varying sequence lengths or batch sizes.
  - **Benefits:**
    - Stabilizes and accelerates training by reducing internal covariate shift.
    - Allows for deeper stacking of layers without degradation in performance.
    - Ensures each token representation maintains a similar scale, which is important for the attention mechanism to function effectively.
  - **Order in Classic Transformer (Vaswani et al., 2017):**
    - Residual addition → LayerNorm (Post-norm)
  - **Alternate (Pre-LN) Variant:**
    - LayerNorm → Sublayer → Residual addition (sometimes used for improved training stability in very deep transformers)

---

### Processing Flow

1. **Input Embeddings** (with positional encodings)
2. → **Multi-Head Self-Attention Layer**  
   - All-to-all information gathering, parallelized over multiple heads.
3. → **Add & Layer Normalization**
4. → **Feed-Forward Network**  
   - Local, position-wise transformation (“decision” at each position).
5. → **Add & Layer Normalization**
6. (Repeat steps 2–5 for N layers)
7. **Final Output Embeddings**

---

### Schematic ASCII Diagram

```
          ┌──────────────────────────────────────────────┐
          │              Transformer Block               │
          │               (repeated N times)             │
          │                                              │
          │   ┌─────────────────────────────────────┐    │
          │   │        Multi-Head Attention         │    │
          │   │  ("Learning/Information Gathering") │    │
          │   └─────────────────────────────────────┘    │
          │                    │                         │
          │         Add & Layer Normalization            │
          │                    │                         │
          │   ┌─────────────────────────────────────┐    │
          │   │   Feed-Forward Neural Network       │    │
          │   │   ("Decision/Local Processing")     │    │
          │   └─────────────────────────────────────┘    │
          │                    │                         │
          │         Add & Layer Normalization            │
          └──────────────────────────────────────────────┘
```

---

### Key Concepts Recap

- **Multi-Head Attention:**  
  Parallel “learning” – each head gathers different information from the sequence.
- **Feed-Forward Network:**  
  Independent “decision” at each position, transforming each token’s representation.
- **Residuals & LayerNorm:**  
  - Residuals keep original and learned information blended.
  - LayerNorm stabilizes and standardizes feature distributions at every step, enabling deep stacking.
- **Stacking:**  
  Layering these blocks enables complex, hierarchical pattern learning.

---
---

## DINO Architecture: Overview

```bibtex
@article{DBLP:journals/corr/abs-2104-14294,
  author       = {Mathilde Caron and
                  Hugo Touvron and
                  Ishan Misra and
                  Herv{\'{e}} J{\'{e}}gou and
                  Julien Mairal and
                  Piotr Bojanowski and
                  Armand Joulin},
  title        = {Emerging Properties in Self-Supervised Vision Transformers},
  journal      = {CoRR},
  volume       = {abs/2104.14294},
  year         = {2021},
  url          = {https://arxiv.org/abs/2104.14294},
  eprinttype   = {arXiv},
  eprint       = {2104.14294},
  timestamp    = {Tue, 04 May 2021 15:12:43 +0200},
  biburl       = {https://dblp.org/rec/journals/corr/abs-2104-14294.bib},
  bibsource    = {dblp computer science bibliography, https://dblp.org}
}
```
---

### Core Structure

DINO (Self-Distillation with No Labels) is a self-supervised learning method for vision transformers (ViTs) and convolutional networks. Its architecture consists of two main networks:

1. **Student Network**  
2. **Teacher Network**  

Both usually share the same architecture (typically a Vision Transformer), but have different parameters during training.

---

### Step 1: Student and Teacher Networks

- **Purpose:**  
  Train a neural network (student) to produce similar representations as another network (teacher), without using any labels.

- **Detailed Process:**  
  1. **Input Augmentation:**  
      - An image is augmented multiple times (different crops, color jittering, etc.) to produce several "views".
  2. **Parallel Processing:**  
      - Both student and teacher networks process these different views of the same image.
  3. **Representation Extraction:**  
      - Each network outputs a vector representation for each view.
  4. **Consistency Loss:**  
      - The student learns by minimizing the difference between its outputs and the teacher's outputs for corresponding views. The teacher's weights are updated as an exponential moving average (EMA) of the student's weights (not by direct backpropagation).

- **Metaphor:**  
  Like a student trying to mimic the answers of a teacher who is always a little ahead, using only what they both "see"—no answer key provided.

---

### Step 2: Vision Transformer Encoder Block

- **Purpose:**  
  Both student and teacher typically use a Vision Transformer (ViT) as their core encoder.
- **How it works:**  
  1. **Patch Embedding:**  
      - The image is split into patches, each patch is linearly embedded into a token.
  2. **Positional Encoding:**  
      - Positional information is added to each token.
  3. **Transformer Layers:**  
      - Multiple layers of multi-head self-attention and feed-forward networks process the tokens (see transformer architecture for details).
  4. **Projection Head:**  
      - The output is passed through a projection head (MLP) to produce the final representation used for the self-supervised loss.

---

### Residuals & Layer Normalization

- Both ViT encoders use residual connections and layer normalization in every transformer block for stability, as described in the standard transformer architecture.

---

### Processing Flow

1. **Input Image**  
2. → **Multiple Augmented Views**  
3. → **Patch Embedding & Positional Encoding** (for each view)  
4. → **Transformer Encoder (Student & Teacher)**  
5. → **Projection Head (MLP for each network)**  
6. → **Self-Distillation Loss: Student mimics Teacher's output**  
7. **Teacher's weights updated via EMA of Student's weights**

---

### Schematic ASCII Diagram

```
                ┌─────────────┐                ┌─────────────┐
     Aug1 ──►   │  Student    │                │   Teacher   │   ◄── Aug2
   (Image View) │  ViT/ConvNet│ ◄── EMA ────── │  ViT/ConvNet│ (Image View)
                └─────┬───────┘                └─────┬───────┘
                      │                              │
             ┌────────▼────────┐             ┌───────▼─────────┐
             │  Projector MLP  │             │  Projector MLP  │
             └────────┬────────┘             └────────┬────────┘
                      │                               │
                  Student Embedding            Teacher Embedding
                      │                               │
                      └─── Self-Distillation Loss ────┘
```

---

### Key Concepts Recap

- **Self-Distillation:**  
  Student learns from teacher, no ground-truth labels needed.
- **EMA Update:**  
  Teacher is a moving average of the student.
- **Vision Transformer Backbone:**  
  Both networks use ViT blocks with residuals and normalization.
- **Augmented Views:**  
  Learning is driven by consistency across multiple views of the same image.

---
---

