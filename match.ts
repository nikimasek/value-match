type EmptyObject = Record<string, never>;
type ObjectPain = Record<string, any>;
type Pattern<T> = T | ((v: unknown) => v is T);
type Result<T> = T extends RegExp ? RegExpMatchArray : T;
type MaperPattern<T> = { [K in keyof T]: Pattern<T[K]> };
type MaperResult<T> = { [K in keyof T]: Result<T[K]> };

type Matcher<I, O> = {
    when<T extends any[]>(p: MaperPattern<T>, c: (v: MaperResult<T>) => O): Matcher<I, O>
    when<T extends EmptyObject>(p: EmptyObject, c: (v: MaperResult<T>) => O): Matcher<I, O>;
    when<T extends ObjectPain>(p: Partial<MaperPattern<T>>, c: (v: MaperResult<T>) => O): Matcher<I, O>
    when<T>(p: Pattern<T>, c: (v: Result<T>) => O): Matcher<I, O>;
    otherwise(c: (v: I) => O): O;
    result?: O;
}

function equals(pattern: unknown, value: any): [boolean, any] {
    if (typeof pattern == 'function') {
        return [pattern(value), value];
    } else if (pattern instanceof RegExp) {
        const x = pattern.exec(value);
        return [Boolean(x), x];
    } else {
        return [pattern === value, value];
    }
}

export function match<I, O>(value: I): Matcher<I, O> {
    return {
        when(pattern: unknown, callback: Function) {
            if (Object.hasOwn(this, 'result')) return this;
            let [m, v]: any[] = [];
            switch (true) {
                case (!pattern): break;
                case Array.isArray(pattern):
                    if (!Array.isArray(value) || pattern.length != value.length) return this;
                    const a = [];
                    for (let index = 0; index < pattern.length; index++) {
                        [m, v] = equals(pattern[index], value[index]);
                        if (!m) return this;
                        a[index] = v;
                    }
                    this.result = callback(a);
                    return this;
                case (typeof pattern == 'object'):
                    if (typeof value != 'object') return this;
                    const o: any = {};
                    for (let key in value) {
                        if (key in pattern) {
                            [m, v] = equals((pattern as any)[key], value[key]);
                            if (!m) return this;
                            o[key] = v;
                        } else {
                            o[key] = value[key];
                        }
                    }
                    this.result = callback(a);
                    return this;
            }
            [m, v] = equals(pattern, value);
            if (m) { this.result = callback(v); }
            return this;
        },
        otherwise(callback: Function) {
            return Object.hasOwn(this, 'result')
                ? this.result
                : callback(value);
        },
    } satisfies Matcher<I, O>;
}
