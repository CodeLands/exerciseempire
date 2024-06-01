export enum Attributes {
    Strength = 'Strength',
    Endurance = 'Endurance',
    Flexibility = 'Flexibility',
    Agility = 'Agility',
}

export enum AttributeColors {
    Red = 'Red',
    Orange = 'Orange',
    Blue = 'Blue',
    Green = 'Green',
}

export const AttributeColorMap: Record<Attributes, AttributeColors> = {
    [Attributes.Strength]: AttributeColors.Red,
    [Attributes.Endurance]: AttributeColors.Orange,
    [Attributes.Flexibility]: AttributeColors.Blue,
    [Attributes.Agility]: AttributeColors.Green,
}