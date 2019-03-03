---
title: HeytingAlgebra.ts
nav_order: 40
parent: Modules
---

# Overview

Heyting algebras are bounded (distributive) lattices that are also equipped with an additional binary operation
`implies` (also written as `→`). Heyting algebras also define a complement operation `not` (sometimes written as
`¬a`)

However, in Heyting algebras this operation is only a pseudo-complement, since Heyting algebras do not necessarily
provide the law of the excluded middle. This means that there is no guarantee that `a ∨ ¬a = 1`.

Heyting algebras model intuitionistic logic. For a model of classical logic, see the boolean algebra type class
implemented as `BooleanAlgebra`.

A `HeytingAlgebra` must satisfy the following laws in addition to `BoundedDistributiveLattice` laws:

- Implication:
  - `a → a = 1`
  - `a ∧ (a → b) = a ∧ b`
  - `b ∧ (a → b) = b`
  - `a → (b ∧ c) = (a → b) ∧ (a → c)`
- Complemented
  - `¬a = a → 0`

<h2 class="text-delta">Table of contents</h2>

- [HeytingAlgebra (interface)](#heytingalgebra-interface)

# HeytingAlgebra (interface)

**Signature**

```ts
export interface HeytingAlgebra<A> extends BoundedDistributiveLattice<A> {
  readonly implies: (x: A, y: A) => A
  readonly not: (x: A) => A
}
```

Added in v1.4.0