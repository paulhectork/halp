# ML ALGORITHMS AND ARCHITECTURES

mahine learning algorithms and architectures

---

## Feature extraction: SIFT

**SIFT is an algorithm, not an architecture**.

### General description

Feature extraction aims to identify important points in an image to provide a "feature description" of the image's content. Those features can then be used to find the same object in different images.

A SIFT feature is:
- **invariant to**: scale and rotation (don't affect the features)
- **robust to**: lighting, affine distorsion, noise (don't affect the features too much)

### SIFT features

A SIFT feature is a tuple:

$$f = (x, y,\sigma, \theta, d)$$

- $(x,y) \in \mathbb{R}^2$ is the keypoint's location in the image, in pixel coordinates
- $\sigma \in \mathbb{R}_{\lt 0}$ is the scale at which the keypoint was detected (i.e., "difference of gaussian extremum")
- $\theta \in \[0,2\pi)$ is the dominant gradiant orientation of the keypoint. It makes the descriptor rotation invariant.
- $d \in \mathbb{R}^{128}$ is the feature descriptor: a 1D vector containing 128 real numbers. It is obtained by:
  - taking a $4 \times 4$ grid around $(x,y)$
  - scaling them by $\sigma$
  - with 8 orientation bins ber cell
  - $\rightarrow 4 \times 4 \times 8 = 128$

**$x, y, \sigma, \theta$ describe** where, at what scale and at what orientation the keypoint was found.  **$d$ describes the local appearence** of the keypoint.
- **keypoint matching** uses only $d$
- **RANSAC** uses only $(x,y)$ (it only compares the geometry of keypoints).

### Stages

The goal is to transform an image into large collection of feature vectors as described above.

#### 1. Scale-space extrema detection

To detect scale-invariant features, we blur the image at increasing scales, and then select candates which are extrema of their neighbouring pixelson the same image, and on less and more blured images.

In more detail,

1. **gaussian blurring.** within each octave (a copy of the image downsampled by 2), the image is blurred with Gaussian filters of increasing scale $\sigma, k\sigma, k^2\sigma, \dots$, producing a stack of blurred images.
2. **Difference-of-Gaussians (DoG).**
  - adjacent blurred images are **subtracted** (a blurred image is subtracted from the next-less-blurred image)
  - we get **a DoG stack**: stack of images at different scales
  - in a DoG stack, **each image keeps the details at one range of scales**,
    - since the subtraction removes both the smooth background and the finest noise.
    - DoG substration produces band-pass representation of the image in which **structure of the image at a given scale** stands out. Indeed, DoG removes:
      - high-fequency spacial information (details, where pixel values change rapidly over short distances)
      - low-fequency spacial information (background, where pixel values are uniform)
3. **features extracted are local extrema**:
  - each pixel $(x, y)$ in a DoG image at scale $\sigma$ has 26 neighbors:
    - 8 pixels in the same DoG image
    - 9 pixels in the DoG image just below in scale
    - 9 pixels in the DoG image just above in scale
  - **the pixel is a candidate keypoint  if it is an extrema of its neighbourhood**:
    - if a pixel is an extrema of the 9 pixels in the image it belongs to, then it stands out.
    - if a pixel is an extrema of the other 18 pixels on the images $\sigma+1$ and $\sigma-1$
    - => a feature that only appears at one blur level is probably a fluke, while a point that is extreme across several levels corresponds to a blob or structure of a definite size. That gives the keypoint its scale $\sigma$.

=> **we have a set of scale invariant candidate keypoints: $\\{(x,y,\sigma)\\}**

#### 2. Keypoint localization

Candidate keypoints are refined and filtered to subpixel accuracy, to keep only the most robust keypoints:

1. **interpolation of the actual extremum**: $(x,y,\sigma)$ of candidate keypoints are defined in pixel space, but the actual extremum may fall between pixels or between scales.
2. **discarding low-contrast keypoints**: keypoints below a certain threshold are discarded because they are sensitive to noise
3. **discarding edge keypoints**: if a keypoint lives along the edges of an object, it is unstable. Discard it.

#### 3. Orientation assignment

Each keypoint is assigned one or more orientations, so that its descriptor can be computed relative to them:

1. **Gradient histogram**: gradient magnitudes and directions are computed in a neighborhood around the keypoint, at its scale $\sigma$, and accumulated into a histogram of 36 bins covering 360°. Each sample is weighted by its gradient magnitude and by a Gaussian window centered on the keypoint.
2. **Dominant orientation**: the highest peak sets the keypoint's orientation $\theta$. Any other peak above 80% of the highest creates an extra keypoint with the same $(x, y, \sigma)$ and a different $\theta$.

#### 4. Keypoint descriptor

The descriptor encodes the local appearance of the keypoint, relative to its orientation:

1. **Rotated patch**: a $16 \times 16$ patch around the keypoint is rotated by $\theta$ and sampled at scale $\sigma$, so the descriptor does not depend on the image's rotation.
2. **Grid histograms**: the patch is split into a $4 \times 4$ grid. Each cell gets an 8-bin histogram of gradient orientations, giving $4 \times 4 \times 8 = 128$ values.
3. **Normalization**: the 128 values are normalized to unit length, clipped at 0.2 to limit the influence of large gradients (such as strong lighting changes), and normalized again.

#### Output

The image is now described by a set of features $\{(x_i, y_i, \sigma_i, \theta_i, d_i)\}$, where $d_i \in \mathbb{R}^{128}$. Features from two images can be compared with the `SIFT -> feature matching -> RANSAC` pipeline described below.

---

## Feature matching: RANSAC

### General description

RANSAC (Random Sample Consensus) is an **iterative algorithm for robust model fitting**: it estimates the parameters of a model from data containing outliers, and as a by-product labels each data point as an inlier or an outlier. (It is not an architecture.)

It takes as an input:
- **$M(P)$**, a mathematical model $M$ taking a set of parameters $P$ that needs to be adjusted.
- **$S$**, a set of observed data points
- **$k$**, the number of iterations
- **$m$**, the minimal number of points needed to fit $M(P)$
  - (e.g. $m=2$ for a line: we need 2 data points to form a line, $m=4$ for a homography)
- **$t$**, an inlier threshold
  - a point $x$ is an inlier if $\text{residual}(x, M(P_i)) < t$ ($\text{residual}$ measures how distant $x$ is from being consistent with model $M(P)$ )

$S$ contains both *inliers* (points whose distribution can be explained by $M(P)$ ) and *outliers* (points that don't fit this model).

**The goal is to**:
- **find the parameters $P^\*$** that fit the largest number of points in $S$
- **define the consensus set $C^\*$**, containing all *inliers*.

### Algorithm

The algorithm is run a fixed number of iterations.

During the execution, $P^\*$ and $C^\*$ describe the best params and consensus set **so far**.

**At each iteration $i = 1, \dots, k$**:
- **randomly sample** a minimal subset $s_i \subset S$ with $|s_i| = m$ ($s_i$ is of size $m$)
- **estimate a new set of parameters** $P_i$ from $s_i$ alone, creating a new hypothesis $M(P_i)$
- **compute a new consensus set** $C_i = \{x \in S : \text{residual}(x, M(P_i)) < t\}$
  - the consensus set is the set of the points that $M(P_i)$ considers inliers
  - the $residual$ computes how far a data point $x$ is rom being consistent with $M(P_i)$.
- **replace the best model** if $|C_i| \gt |C^*|$ (consensus set for $i$ is larger than the consensus set of the current best model):
  - $P^\* \leftarrow P_i$ ( $P_i$ becomes the new best params $P^*$ )
  - $C^\* \leftarrow C_i$ ( $C_i$ becomes the new consensus set $C^*$ )
- **otherwise, discard** $M(P_i)$

**After the last iteration**:
- optionally refit $P^\*$ on all points in $C^\*$ (e.g. by least squares) to refine the estimate
- label the points in $C^\*$ as inliers and the rest of $S$ as outliers

### In computer vision

RANSAC is used for **feature matching**: find common points within a set of images.

The pipeline is: `SIFT -> descriptor maching -> RANSAC`

#### 1. `SIFT` **feature extraction**

Among a set of images $S = \{A, B, \dots \}$, extract for each image a set of keypoints. Each keypoint has a 128-dimensional descriptor ( $d_A$  for image $A$ ).

#### 2. **descriptor matching**
- for each keypoint $i$ in image $A$ (with descriptor $d_A^{(i)}$ )
  - compute distance to every descriptor $d_B^{(j)}$ in $B$ (descriptors for each keypoint $j$ in $B$):
  - keep the nearest distances $d_1$ and $d_2$ (corresponding to the 2 closest descriptors in $B$:
    - $d_1$ is the distance between $d_A^{(i)}$ and $d_B^{(j_1)}$
    - $d_2$ is the distance between $d_A^{(i)}$ and $d_B^{(j_2)}$
  - if $\frac{d_1}{d_2} \lt 0.75$ , the match is trustworthy:
    - descriptors $d_A^{(i)}$ $d_B^{(j_1)}$ matched,
    - so **$i$ and $j$ are matched keypoints**.
- output is a **set $\\{(i, j)\\}$ of all matched keypoints between $A$ and $B$**.

#### 3. `RANSAC` feature matching

RANSAC is used for **geometry filtering**: since we are working on images, correct matches should **agree with a geometric transformation**. Given the matched keypoints $I$ in $A$ and their partners $J$ in $B$, there should be a transformation $T$ that maps each $i \in I$ to its partner $j \in J$:

$$I \times T = J$$

RANSAC estimates $T$ from the matches, then keeps the matches that agree with it:
- a match $(i, j)$ is an inlier if its residual under $T$ is below the threshold $t$
- a match that does not agree with $T$ is an outlier and is dropped

**What is $T$ ?**
- in 2D, a translation / scale / rotation / affine transform / homography
- in 3D, a fundamental matrix $F$

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

