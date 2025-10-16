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

---

## Probabilities

- $$\mathbb{E}$$: expectation / espérance mathématique 
    - $$\mathbb{E}(X)$$ is the probability to obtain $$X$$.
    - $$\mathbb{E}$$ is a generalisation of the mean (average). for a random variable, the expectation gives the average value you would get if you repeated an experiment many times.
- $$\sim$$: tiré de / randomly extracted from a distribution.
    - given: 
        - $$X$$ and $$Y$$ 2 sets, $$x \in X$$ and $$y \in Y$$
        - $$Z=(X,Y)$$ the distribution of $$(X,Y)$$ along a probability function $$P$$ ($$Z$$ is all the possible $$(x,y)$$ pairs distributed along $$P$$)
        - $$E_(x,y) \sim Z$$: the expectation for all tuples $$(x,y)$$ extracted from $$Z$$
    - $$(x,y) \sim Z$$ means "a tuple $$(x,y)$$ randomly extracted from a distribution $$Z$$"
- $$\mathbb{E}[expr]$$: the brackets are the argument of $$\mathbb{E}$$: we are calculating the expectation to obtain a certain result with function $$expr$$.
    - so: $$\mathbb{E}_{(x,y) \sim Z}[l(f(x),y)]$$, means that:
        - $$\mathbb{E}_{(x,y) \sim Z}$$: we are calculating $$\mathbb{E}$$ using all $$(x,y)$$ values extracted from $$Z$$
        - $$l(f(x),y)$$ is calculated over all values of $$Z$$ (it is a loss function comparing the output of function $$f$$ to an expected $$y$$)
        - $$\mathbb{E}$$ is the average of all results of $$l(f(x),y)$$ for all $$(x,y)$$ in $$Z$$
