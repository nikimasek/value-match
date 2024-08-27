# value-match

## Comparing values

To compare values, you can use the evaluation authenticity function or the value for comparison. Attention, it is not possible to use a Function, Object, or Array as a value.

```
match(value)
    .when('x', () => 'string')
    .when(100, () => 'number')
    .when(Array.isArray, () => 'is array')
    .when(o => o instanceof Map, () => 'is map')
    .when(/^(.)/, ([_,first]) => `string start with '${first}'`)
    .return;
```

## Comparison of structures

Array (Tuple) and Object are taken as structure. For structures, only the first level can be compared, nested values ​​can only be compared as values.

### Array (Tuple)

Must be of equal length and all values ​​must compare positively.

```
match(tuple)
    .when([], () => 'empty')
    .when([true, false], () => 'true-false')
    .when([true, true], () => 'true-true')
    .result;
```

### Object

Object is compared so that it must contain template keys and have a positive comparison.

```
match(object)
    .when({ code: 1 }, () => 'code = 1')
    .when({ code: 2 }, () => 'code = 2')
    .when({ text: 'test' }, () => 'has text')
    .otherwise(() => 'something else')
```
