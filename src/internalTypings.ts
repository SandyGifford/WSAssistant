export type SelectProps<Base, Condition> = {
	[Key in keyof Base]: Base[Key] extends Condition ? Key : never
};

export type SelectNames<Base, Condition> = SelectProps<Base, Condition>[keyof Base];

export type SelectSubType<Base, Condition> = Pick<Base, SelectNames<Base, Condition>>;

export type ExcludeProps<Base, Condition> = {
	[Key in keyof Base]: Base[Key] extends Condition ? never : Key
};

export type ExcludeNames<Base, Condition> = ExcludeProps<Base, Condition>[keyof Base];

export type ExcludeSubType<Base, Condition> = Pick<Base, ExcludeNames<Base, Condition>>;
