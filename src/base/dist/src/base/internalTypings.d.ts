export declare type SelectProps<Base, Condition> = {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};
export declare type SelectNames<Base, Condition> = SelectProps<Base, Condition>[keyof Base];
export declare type SelectSubType<Base, Condition> = Pick<Base, SelectNames<Base, Condition>>;
export declare type ExcludeProps<Base, Condition> = {
    [Key in keyof Base]: Base[Key] extends Condition ? never : Key;
};
export declare type ExcludeNames<Base, Condition> = ExcludeProps<Base, Condition>[keyof Base];
export declare type ExcludeSubType<Base, Condition> = Pick<Base, ExcludeNames<Base, Condition>>;
