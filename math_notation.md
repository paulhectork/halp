# Math notation

---

## Logic

- $$\exists$$: exists
- $$\exists!$$: uniqueness (exists one and only one)
- $$\nexists$$: does not exist
- $$\forall$$: for all
- $$\neg$$: logical negation
- $$\lor$$: logical or
- $$\land$$: logical and
- $$\top$$: true or always true
- $$\bot$$: false or always false

---

## Sets

**Some sets**

- $$\mathbb{R}$$: real numbers
- $$\mathbb{N}$$: natural numbers (positive integers)
- $$\mathbb{Z}$$: integers
- $$\mathbb{Q}$$: rational numbers (fraction of 2 integers)

**Relations between sets**

- $$\in$$: belongs to
- $$\cap$$: intersection
- $$\cup$$: union
- $$\subset$$: inclusion: $$x \subset y$$ means that $$x$$ includes $$y$$
- $$\supset$$: superset: $$x \supset y$$ means that $$x$$ is included by $$y$$
- $$\ni$$: contains: $$x \ni y$$ means that $$x$$ contains $$y$$
- $$\setminus$$ or $$-$$: set difference. $$Z = X \setminus Y$$ means that $$Z$$ is formed by the elements of $$X$$ that are not in $$Y$$
- $$\times$$: cartesian product

**Other**
- $$\emptyset$$: empty set
- `#X` or $$|X|$$: number of elements of set $$X$$
- $$\mathbb{R}^{n}$$: all $$n$$-uples whose members belong to $$\mathbb{R}$$. See `linear algebra`.

---

## Linear algebra

Tensors, matrices, vectors:

- **a vector** is a 1-dimensional array: 

$$v =\begin{pmatrix} x & y & z \end{pmatrix}$$

- **a matrix** is a 2-dimensional array: 

$$m =\begin{pmatrix} a & b & c\\\ x & y & z \end{pmatrix}$$

- **a tensor** is an n-dimensional array => **a tensor is a generalization of matrices to any number of dimensions**: 1D tensor = vector, 2D tensor = matrix...
- in deep learning, we use tensors as a general term for n-dimensional arrays.

Linear algebra works on vector spaces and linear transforms.

- $$\Sigma$$: sum 
- $$\Pi$$: product
- $$\otimes$$: tensor product of 2 vectors or matrices
- $$\oplus$$: direct sum of 2 vectors or matrices
- $$M^{T}$$: transposition
- $$X \times Y$$, with $$X$$ and $$Y$$ vector spaces, is the **cartesian product** of $$X$$ with $$Y$$
- $$||X||$$: norm of a vector space. The "norm" is equivalent to the notion of "length"
    - $$||y - x||$$ is the distance between 2 vectors $$y$$ and $$x$$.
- $$\mathbb{R}^{n}$$: defines a vector space of dimension $$n$$. $$n$$ being a positive integer, all vectors belonging to $$\mathbb{R}^{n}$$ are of size $$n$$.
    - $$x \in \mathbb{R}^{2}$$ => $$x = (1,2)$$
    - $$x \in \mathbb{R}^{3}$$ => $$x = (1,2,3)$$
- $$\text{argmax}$$ / $$\text{argmin}$$: input points at which the output value of a function is maximised/minimised (parameters for which you get the biggest/smallest value) 
- $$I_n$$: identity matrix (a square matrix of size $$n$$ where the diagonal values are $$1$$ and all other values $$0$$): 

$$I_3 = \begin{pmatrix} 1 & 0 & 0\\\ 0 & 1 & 0\\\ 0 & 0 & 1\end{pmatrix}$$

---

## Probabilities

- $$\mathbb{E}$$: expectation / espérance mathématique 
    - $$\mathbb{E}(X)$$ is the probability to obtain $$X$$.
    - $$\mathbb{E}$$ is a generalisation of the mean (average). for a random variable, the expectation gives the average value you would get if you repeated an experiment many times.
- $$\mathbb{E}[expr]$$: the brackets are the argument of $$\mathbb{E}$$: we are calculating the expectation to obtain a certain result with function $$expr$$.
- $$\sim$$: tiré de / randomly extracted from a distribution.
    - given: 
        - $$X$$ and $$Y$$ 2 sets, $$x \in X$$ and $$y \in Y$$
        - $$Z=(X,Y)$$ the distribution of $$(X,Y)$$ along a probability function $$P$$ ($$Z$$ is all the possible $$(x,y)$$ pairs distributed along $$P$$)
    - => $$(x,y) \sim Z$$ means "a tuple $$(x,y)$$ randomly extracted from a distribution $$Z$$"
    - $$E_{(x,y) \sim Z}$$: the expectation for all tuples $$(x,y)$$ extracted from $$Z$$

So: $$\mathbb{E}_{(x,y) \sim Z}[l(f(x),y)]$$ means that:
- $$l(f(x),y)$$ is the function we're calculating the expectation $$\mathbb{E}$$ of. $$l$$ is a loss function comparing the actual output $$f(x)$$ with expected output $$y$$
- $$\mathbb{E}_{(x,y) \sim Z}$$: we are calculating $$\mathbb{E}$$ using all $$(x,y)$$ values extracted from $$Z$$
- $$l(f(x),y)$$ is calculated over all values of $$Z$$ ($$l$$ is a loss function comparing the output of function $$f$$ to an expected $$y$$
- => $$\mathbb{E}_{(x,y) \sim Z}[l(f(x),y)]$$ means that we're averaging the loss $$l(f(x), y)$$ over all $$(x, y)$$ pairs that could be drawn from $$Z$$

--- 

## Various 

- $$\circ$$: function composition ($$(g \circ f)(x)$$ is the same as $$g(f(x))$$)

