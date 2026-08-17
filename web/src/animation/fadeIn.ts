// Pairs with `[data-fade]` in fade.css. Components declare *where* they sit in
// the sequence; fade.css owns what that costs in milliseconds.
export const fadeIn = (step = 0) => ({ fade: true, fadeStep: step });
