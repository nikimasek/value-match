# value-match

minimalistic TypeScript module for pattern matching

## Tuple

the comparison only works for the first level

```
match(tuple)
    .when([], () => 'empty')
    .when([true, false], () => 'true-false')
    .when([true, true], () => 'true-true')
    .result;
```

## Object

the comparison only works for the first level

```
match(object)
    .when({ code: 1 }, () => 'code = 1')
    .when({ code: 2 }, () => 'code = 2')
    .otherwise(() => 'something else')
```

## Pattern

```
match(value)
    .when(Array.isArray, () => 'is array')
    .when(o => o instanceof Map, () => 'is map')
    .return;
```

## Value

```
match(value)
    .when('x', () => 'string')
    .when(100, () => 'number')
    .when(/^(.)/, ([_,first]) => `string start with '${first}'`)
    .return;
```